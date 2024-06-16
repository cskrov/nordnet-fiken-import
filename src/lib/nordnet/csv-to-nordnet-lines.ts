import { parseMoney } from "@app/lib/money";
import type { CsvFile } from "@app/lib/csv";
import { parse, isLastDayOfMonth, endOfMonth, addMonths } from "date-fns";
import { NordnetErrorType, NordnetType, isNordnetType, type NordnetError, type NordnetLine, type RawNordnetLine } from "@app/lib/nordnet/types";

export const NORDNET_HEADER_ID = "Id";
export const NORDNET_HEADER_BOKFORT_DATO = "Bokføringsdag";
export const NORDNET_HEADER_KONTO = "Portefølje";
export const NORDNET_HEADER_BELØP = "Beløp";
export const NORDNET_HEADER_SALDO = "Saldo";
export const NORDNET_HEADER_TRANSAKSJONSTEKST = "Transaksjonstekst";
export const NORDNET_HEADER_TYPE = "Transaksjonstype";
export const NORDNET_HEADER_VERDIPAPIR = "Verdipapir";
export const NORDNET_HEADER_ISIN = "ISIN";

const NORDNET_HEADERS = [
  NORDNET_HEADER_ID,
  NORDNET_HEADER_BOKFORT_DATO,
  NORDNET_HEADER_KONTO,
  NORDNET_HEADER_BELØP,
  NORDNET_HEADER_SALDO,
  NORDNET_HEADER_TRANSAKSJONSTEKST,
  NORDNET_HEADER_TYPE,
  NORDNET_HEADER_VERDIPAPIR,
  NORDNET_HEADER_ISIN
];

export const toNordnetLines = (csvFiles: CsvFile[]): NordnetLine[] => {
  const referenceDate = new Date();

  const rawNordnetRows = csvFiles.flatMap(({ fileName, data }) => {
    const { headers, rows } = data;

    const headerIndexes = NORDNET_HEADERS.map((h) => headers.indexOf(h));

    const missingHeaderIndexes = headerIndexes.filter((i) => i === -1);

    if (missingHeaderIndexes.length !== 0) {
      throw new Error(`Mangler kolonner i eksport fra Nordnet: ${missingHeaderIndexes.map((i) => NORDNET_HEADERS[i]).join(", ")}`);
    }

    const [idIndex, bokførtDatoIndex, kontoIndex, beløpIndex, saldoIndex, transaksjonstekstekstIndex, typeIndex, verdipapirIndex, isinIndex] = headerIndexes;

    if (idIndex === undefined || bokførtDatoIndex === undefined || kontoIndex === undefined || beløpIndex === undefined || saldoIndex === undefined || transaksjonstekstekstIndex === undefined || typeIndex === undefined || verdipapirIndex === undefined || isinIndex === undefined) {
      throw new Error("Kolonner mangler i eksport fra Nordnet");
    }

    return rows.map<RawNordnetLine>((row, rowNumber) => {
      const bokførtDato = parse(row[bokførtDatoIndex]!, 'yyyy-MM-dd', referenceDate);
      const year = bokførtDato.getFullYear();
      const month = bokførtDato.getMonth() + 1;

      return ({
        id: row[idIndex]!,
        bokførtDato,
        portefølje: row[kontoIndex]!,
        transaksjonstype: row[typeIndex]!,
        beløp: parseMoney(row[beløpIndex]!),
        saldo: parseMoney(row[saldoIndex]!),
        transaksjonstekst: row[transaksjonstekstekstIndex]!,
        verdipapir: row[verdipapirIndex]!,
        ISIN: row[isinIndex]!,
        source: { fileName, rowNumber, year, month }
      })
    }).toReversed();
  });

  const nordnetLines = rawNordnetRows.map<NordnetLine>((row) => {
    const { id, bokførtDato, portefølje, transaksjonstype, beløp, saldo, transaksjonstekst: forklarendeTekst, source } = row;
    const hasNordnetType = isNordnetType(transaksjonstype);

    return {
      referanse: id,
      bokførtDato,
      tilKonto: portefølje,
      beløp: beløp,
      saldo,
      transaksjonstekst: forklarendeTekst,
      type: hasNordnetType ? transaksjonstype : NordnetType.UKJENT,
      verdipapir: row.verdipapir,
      ISIN: row.ISIN,
      source,
      errors: hasNordnetType ? [] : [{
        errorType: NordnetErrorType.UKJENT_TYPE,
        transaksjonstype,
      }],
    } satisfies NordnetLine;
  });

  return nordnetLines.flatMap((line, index) => {
    const previousLine = nordnetLines.at(index - 1);

    const errors: NordnetError[] = (previousLine !== undefined && previousLine.saldo !== (line.saldo + line.beløp)) ? [...line.errors, {
      errorType: NordnetErrorType.SALDO_MISMATCH,
      previousLine,
      line
    }] : line.errors;

    const nextLine = nordnetLines.at(index + 1);

    if (nextLine === undefined) {
      return { ...line, errors };
    }

    const currentLineMonth = line.source.month;
    const nextLineMonth = nextLine.source.month;

    const monthDiff = nextLineMonth - currentLineMonth;

    // Lines are in the same month.
    if (monthDiff === 0) {
      return { ...line, errors };
    }

    const start = isLastDayOfMonth(line.bokførtDato) ? 1 : 0;

    // Generate missing end of month lines.
    const missingMonths: NordnetLine[] = new Array(monthDiff - 1);

    for (let i = start; i < monthDiff; i++) {
      missingMonths.push({
        bokførtDato: endOfMonth(addMonths(line.bokførtDato, i)),
        tilKonto: line.tilKonto,
        beløp: 0,
        saldo: line.saldo,
        transaksjonstekst: "Saldo",
        type: NordnetType.SALDO,
        referanse: null,
        verdipapir: null,
        ISIN: '',
        source: { ...line.source, fileName: null, rowNumber: -1, },
        errors: line.errors,
      });
    }

    // Add missing end of month lines.
    return [{ ...line, errors }, ...missingMonths];
  });
};
