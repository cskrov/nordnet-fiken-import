import type { Csv, CsvRow } from '@app/lib/csv';
import type { FikenLine } from '@app/lib/fiken/types';
import { formatMoney } from '@app/lib/money';
import { NordnetType } from '@app/lib/nordnet/types';
import { format } from 'date-fns';

export const FIKEN_CSV_HEADERS = [
  'Bokført dato',
  'Fra konto',
  'Til konto',
  'Forklarende tekst',
  'ISIN',
  'Inngående',
  'Ut',
  'Inn',
  'Saldo',
  'Referanse',
];

export const FIKEN_TABLE_HEADERS = [...FIKEN_CSV_HEADERS, 'Fra fil (linje)'];

export const toFikenCsv = (fikenLines: FikenLine[]): Csv => {
  if (fikenLines.length === 0) {
    throw new Error('Ingen linjer å laste ned.');
  }

  const missingAccountNumberCount = fikenLines.filter(
    (line) => lineRequiresAccountNumber(line) && isNullOrEmpty(line.fraKonto()),
  ).length;

  if (missingAccountNumberCount === 1) {
    throw new Error('Én linje mangler kontonummer.');
  }

  if (missingAccountNumberCount > 1) {
    throw new Error(`${missingAccountNumberCount} linjer mangler kontonummer.`);
  }

  const rows = fikenLines.map<CsvRow>(
    ({ bokførtDato, fraKonto, tilKonto, forklarendeTekst, isin, inngående, ut, inn, saldo, referanse }) => [
      format(bokførtDato, 'yyyy-MM-dd'),
      fraKonto() ?? '',
      tilKonto() ?? '',
      forklarendeTekst(),
      isin ?? '',
      formatMoney(inngående),
      formatMoney(ut),
      formatMoney(inn),
      formatMoney(saldo),
      referanse,
    ],
  );

  if (rows.some((row) => row.length !== FIKEN_CSV_HEADERS.length)) {
    throw new Error('Unexpected technical error: One or more rows have different length than headers.');
  }

  return { headers: FIKEN_CSV_HEADERS, rows };
};

const lineRequiresAccountNumber = (line: FikenLine): boolean =>
  line.type === NordnetType.INNSKUDD || line.type === NordnetType.UTTAK;

const isNullOrEmpty = (s: string | null): boolean => s === null || s.length === 0;
