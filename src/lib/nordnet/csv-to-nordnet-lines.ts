import { addMonths, endOfMonth, isLastDayOfMonth, isSameMonth, parse } from 'date-fns';
import type { CsvFile } from '@/lib/csv';
import { parseMoney } from '@/lib/money';
import { isNordnetType, type NordnetLine, NordnetType } from '@/lib/nordnet/types';
import { pad } from '@/lib/pad-number';

const NORDNET_HEADER_ID = 'Id';
const NORDNET_HEADER_BOKFØRINGSDAG = 'Bokføringsdag';
const NORDNET_HEADER_HANDELSDAG = 'Handelsdag';
const NORDNET_HEADER_OPPGJØRSDAG = 'Oppgjørsdag';
const NORDNET_HEADER_PORTEFØLJE = 'Portefølje';
const NORDNET_HEADER_TRANSAKSJONSTYPE = 'Transaksjonstype';
const NORDNET_HEADER_VERDIPAPIR = 'Verdipapir';
const NORDNET_HEADER_ISIN = 'ISIN';
const NORDNET_HEADER_BELØP = 'Beløp';
const NORDNET_HEADER_SALDO = 'Saldo';
const NORDNET_HEADER_TRANSAKSJONSTEKST = 'Transaksjonstekst';

const NORDNET_HEADERS = [
  NORDNET_HEADER_ID,
  NORDNET_HEADER_BOKFØRINGSDAG,
  NORDNET_HEADER_HANDELSDAG,
  NORDNET_HEADER_OPPGJØRSDAG,
  NORDNET_HEADER_PORTEFØLJE,
  NORDNET_HEADER_TRANSAKSJONSTYPE,
  NORDNET_HEADER_VERDIPAPIR,
  NORDNET_HEADER_ISIN,
  NORDNET_HEADER_BELØP,
  NORDNET_HEADER_SALDO,
  NORDNET_HEADER_TRANSAKSJONSTEKST,
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
      handelsDatoIndex,
      oppgjørsDatoIndex,
      kontoIndex,
      typeIndex,
      verdipapirIndex,
      isinIndex,
      beløpIndex,
      saldoIndex,
      transaksjonstekstekstIndex,
    ] = headerIndexes;

    if (
      idIndex === undefined ||
      bokførtDatoIndex === undefined ||
      handelsDatoIndex === undefined ||
      oppgjørsDatoIndex === undefined ||
      kontoIndex === undefined ||
      typeIndex === undefined ||
      verdipapirIndex === undefined ||
      isinIndex === undefined ||
      beløpIndex === undefined ||
      saldoIndex === undefined ||
      transaksjonstekstekstIndex === undefined
    ) {
      throw new Error('Kolonner mangler i eksport fra Nordnet');
    }

    return rows
      .map<NordnetLine>((row, rowNumber) => {
        const bokførtDato = parse(row[bokførtDatoIndex] ?? '', 'yyyy-MM-dd', referenceDate);
        const handelsDato = parse(row[handelsDatoIndex] ?? '', 'yyyy-MM-dd', referenceDate);
        const oppgjørsDato = parse(row[oppgjørsDatoIndex] ?? '', 'yyyy-MM-dd', referenceDate);
        const year = handelsDato.getFullYear();
        const month = handelsDato.getMonth() + 1;
        const transaksjonstype = row[typeIndex] ?? '';

        return {
          id: row[idIndex] ?? '',
          bokførtDato,
          handelsDato,
          oppgjørsDato,
          portefølje: row[kontoIndex] ?? '',
          transaksjonstype,
          beløp: parseMoney(row[beløpIndex] ?? ''),
          saldo: parseMoney(row[saldoIndex] ?? ''),
          transaksjonstekst: row[transaksjonstekstekstIndex] ?? '',
          verdipapir: row[verdipapirIndex] ?? '',
          ISIN: row[isinIndex] ?? '',
          month,
          year,
          source: { fileName, rowNumber },
          generated: false,
          unexpectedSaldo: false,
          unknownType: !isNordnetType(transaksjonstype),
        };
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
  nordnetLines.toSorted((a, b) => a.id.length - b.id.length || a.id.localeCompare(b.id));

const generateMissingLines = (nordnetLines: NordnetLine[]): NordnetLine[] => {
  const now = new Date();

  return nordnetLines.flatMap((line, index) => {
    const nextLine = nordnetLines.at(index + 1);

    if (nextLine === undefined) {
      if (isSameMonth(line.handelsDato, now) || isLastDayOfMonth(line.handelsDato)) {
        return line;
      }

      return [
        line,
        {
          bokførtDato: endOfMonth(line.handelsDato),
          handelsDato: endOfMonth(line.handelsDato),
          oppgjørsDato: endOfMonth(line.handelsDato),
          portefølje: line.portefølje,
          beløp: 0n,
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
          unexpectedSaldo: false,
          unknownType: false,
        } satisfies NordnetLine,
      ];
    }

    const currentLineMonth = line.month;
    const nextLineMonth = nextLine.month;

    const monthDiff = nextLineMonth - currentLineMonth;

    // Lines are in the same month.
    if (monthDiff === 0) {
      return line;
    }

    const expectedSaldo = nextLine.saldo - nextLine.beløp;
    const unexpectedSaldo = line.saldo !== expectedSaldo;

    const start = isLastDayOfMonth(line.handelsDato) ? 1 : 0;

    // Generate missing end of month lines.
    const missingMonths: NordnetLine[] = [];

    for (let i = start; i < monthDiff; i++) {
      const month = currentLineMonth + (i % 12);
      const year = currentLineMonth === 12 ? line.year + 1 : line.year;

      missingMonths.push({
        bokførtDato: endOfMonth(addMonths(line.handelsDato, i)),
        handelsDato: endOfMonth(addMonths(line.handelsDato, i)),
        oppgjørsDato: endOfMonth(addMonths(line.handelsDato, i)),
        portefølje: line.portefølje,
        beløp: 0n,
        saldo: line.saldo,
        transaksjonstekst: 'Saldo',
        transaksjonstype: NordnetType.SALDO,
        id: `generert-saldo-${year}-${pad(month)}`,
        verdipapir: null,
        ISIN: null,
        month,
        year,
        source: { fileName: null, rowNumber: -1 },
        generated: true,
        unexpectedSaldo,
        unknownType: false,
      });
    }

    // Add missing end of month lines.
    return [line, ...missingMonths];
  });
};

export const fixNordnetLines = (lines: NordnetLine[]): NordnetLine[] =>
  generateMissingLines(sortNordnetLines(deduplicateNordnetLines(lines)));

export const groupNordnetLinesByAccount = (lines: NordnetLine[]): Map<string, NordnetLine[]> => {
  const groups = new Map<string, NordnetLine[]>();

  for (const line of lines) {
    const existing = groups.get(line.portefølje);

    if (existing !== undefined) {
      existing.push(line);
    } else {
      groups.set(line.portefølje, [line]);
    }
  }

  return groups;
};
