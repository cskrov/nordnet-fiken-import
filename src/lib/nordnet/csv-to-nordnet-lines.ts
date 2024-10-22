import { chain } from '@app/lib/chain';
import type { CsvFile } from '@app/lib/csv';
import { parseMoney } from '@app/lib/money';
import { type NordnetLine, NordnetType } from '@app/lib/nordnet/types';
import { pad } from '@app/lib/pad-number';
import { addMonths, endOfMonth, isLastDayOfMonth, isSameMonth, parse } from 'date-fns';

export const NORDNET_HEADER_ID = 'Id';
export const NORDNET_HEADER_BOKFORT_DATO = 'Bokføringsdag';
export const NORDNET_HEADER_KONTO = 'Portefølje';
export const NORDNET_HEADER_BELØP = 'Beløp';
export const NORDNET_HEADER_SALDO = 'Saldo';
export const NORDNET_HEADER_TRANSAKSJONSTEKST = 'Transaksjonstekst';
export const NORDNET_HEADER_TYPE = 'Transaksjonstype';
export const NORDNET_HEADER_VERDIPAPIR = 'Verdipapir';
export const NORDNET_HEADER_ISIN = 'ISIN';

const NORDNET_HEADERS = [
  NORDNET_HEADER_ID,
  NORDNET_HEADER_BOKFORT_DATO,
  NORDNET_HEADER_KONTO,
  NORDNET_HEADER_BELØP,
  NORDNET_HEADER_SALDO,
  NORDNET_HEADER_TRANSAKSJONSTEKST,
  NORDNET_HEADER_TYPE,
  NORDNET_HEADER_VERDIPAPIR,
  NORDNET_HEADER_ISIN,
];

export const toNordnetLines = (csvFiles: CsvFile[]): NordnetLine[] => {
  const referenceDate = new Date();

  return csvFiles.flatMap(({ fileName, data }) => {
    const { headers, rows } = data;

    const headerIndexes = NORDNET_HEADERS.map((h) => headers.indexOf(h));

    const missingHeaderIndexes = headerIndexes.filter((i) => i === -1);

    if (missingHeaderIndexes.length !== 0) {
      throw new Error(
        `Mangler kolonner i eksport fra Nordnet: ${missingHeaderIndexes.map((i) => NORDNET_HEADERS[i]).join(', ')}`,
      );
    }

    const [
      idIndex,
      bokførtDatoIndex,
      kontoIndex,
      beløpIndex,
      saldoIndex,
      transaksjonstekstekstIndex,
      typeIndex,
      verdipapirIndex,
      isinIndex,
    ] = headerIndexes;

    if (
      idIndex === undefined ||
      bokførtDatoIndex === undefined ||
      kontoIndex === undefined ||
      beløpIndex === undefined ||
      saldoIndex === undefined ||
      transaksjonstekstekstIndex === undefined ||
      typeIndex === undefined ||
      verdipapirIndex === undefined ||
      isinIndex === undefined
    ) {
      throw new Error('Kolonner mangler i eksport fra Nordnet');
    }

    return rows
      .map<NordnetLine>((row, rowNumber) => {
        const bokførtDato = parse(row[bokførtDatoIndex] ?? '', 'yyyy-MM-dd', referenceDate);
        const year = bokførtDato.getFullYear();
        const month = bokførtDato.getMonth() + 1;

        return {
          id: row[idIndex] ?? '',
          bokførtDato,
          portefølje: row[kontoIndex] ?? '',
          transaksjonstype: row[typeIndex] ?? '',
          beløp: parseMoney(row[beløpIndex] ?? ''),
          saldo: parseMoney(row[saldoIndex] ?? ''),
          transaksjonstekst: row[transaksjonstekstekstIndex] ?? '',
          verdipapir: row[verdipapirIndex] ?? '',
          ISIN: row[isinIndex] ?? '',
          month,
          year,
          source: { fileName, rowNumber },
          generated: false,
        } satisfies NordnetLine;
      })
      .toReversed();
  });
};

const deduplicateNordnetLines = (nordnetLines: NordnetLine[]): NordnetLine[] => {
  const uniqueIds = new Set<string>();
  const uniqueLines: NordnetLine[] = [];

  for (const line of nordnetLines) {
    if (uniqueIds.has(line.id)) {
      continue;
    }

    uniqueIds.add(line.id);
    uniqueLines.push(line);
  }

  return uniqueLines;
};

const sortNordnetLines = (nordnetLines: NordnetLine[]): NordnetLine[] =>
  nordnetLines.toSorted((a, b) => {
    return a.bokførtDato.getTime() - b.bokførtDato.getTime();
  });

const generateMissingLines = (nordnetLines: NordnetLine[]): NordnetLine[] => {
  const now = new Date();

  return nordnetLines.flatMap((line, index) => {
    const nextLine = nordnetLines.at(index + 1);

    if (nextLine === undefined) {
      if (isSameMonth(line.bokførtDato, now) || isLastDayOfMonth(line.bokførtDato)) {
        return line;
      }

      return [
        line,
        {
          bokførtDato: endOfMonth(line.bokførtDato),
          portefølje: line.portefølje,
          beløp: 0,
          saldo: line.saldo,
          transaksjonstekst: 'Saldo',
          transaksjonstype: NordnetType.SALDO,
          id: `generert-saldo-${line.year}-${pad(line.month)}`,
          verdipapir: null,
          ISIN: '',
          month: line.month,
          year: line.year,
          source: { fileName: null, rowNumber: -1 },
          generated: true,
        },
      ];
    }

    const currentLineMonth = line.month;
    const nextLineMonth = nextLine.month;

    const monthDiff = nextLineMonth - currentLineMonth;

    // Lines are in the same month.
    if (monthDiff === 0) {
      return line;
    }

    const start = isLastDayOfMonth(line.bokførtDato) ? 1 : 0;

    // Generate missing end of month lines.
    const missingMonths: NordnetLine[] = [];

    for (let i = start; i < monthDiff; i++) {
      const month = currentLineMonth + (i % 12);
      const year = currentLineMonth === 12 ? line.year + 1 : line.year;

      missingMonths.push({
        bokførtDato: endOfMonth(addMonths(line.bokførtDato, i)),
        portefølje: line.portefølje,
        beløp: 0,
        saldo: line.saldo,
        transaksjonstekst: 'Saldo',
        transaksjonstype: NordnetType.SALDO,
        id: `generert-saldo-${year}-${pad(month)}`,
        verdipapir: null,
        ISIN: '',
        month,
        year,
        source: { fileName: null, rowNumber: -1 },
        generated: true,
      });
    }

    // Add missing end of month lines.
    return [line, ...missingMonths];
  });
};

export const fixNordnetLines = chain(deduplicateNordnetLines, sortNordnetLines, generateMissingLines);
