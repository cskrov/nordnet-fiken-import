import type { Csv, CsvRow } from "@app/lib/csv";
import { formatMoney } from "@app/lib/money";
import { NordnetType, type NordnetLine, type NordnetLineSource } from "@app/lib/nordnet/types";
import { format } from "date-fns";

export const FIKEN_CSV_HEADERS = [
  "Bokført dato",
  "Fra konto",
  "Til konto",
  "Forklarende tekst",
  "ISIN",
  "Inngående",
  "Ut",
  "Inn",
  "Saldo",
  "Referanse"
];

export const FIKEN_TABLE_HEADERS = [...FIKEN_CSV_HEADERS, "Status", "Fra fil (linje)"];

export interface FikenLine {
  readonly type: NordnetType;
  fraKonto: string | null;
  readonly tilKonto: string;
  readonly isin: string | null;
  readonly bokførtDato: Date;
  readonly forklarendeTekst: string;
  readonly inngående: number;
  readonly ut: number;
  readonly inn: number;
  readonly saldo: number;
  readonly referanse: string | null;
  readonly source: NordnetLineSource;
  readonly difference: number;
}

export interface FikenFile {
  readonly fileName: string;
  readonly rows: FikenLine[];
}

const getForklarendeTekst = (nordnetLine: NordnetLine): string => {
  if (nordnetLine.type === NordnetType.KJØPT) {
    return `Kjøp av ${nordnetLine.verdipapir} (${nordnetLine.ISIN})`;
  }

  if (nordnetLine.type === NordnetType.SOLGT) {
    return `Salg av ${nordnetLine.verdipapir} (${nordnetLine.ISIN})`;
  }

  return nordnetLine.transaksjonstekst;
}

const ACCOUNT_NUMBER_REGEX = /[0-9]{8,11}$/;

const attemptToExtractAccountNumber = (text: string): string | null => {
  const match = text.match(ACCOUNT_NUMBER_REGEX);

  return match ? match[0] : null;
}

export const toFikenLines = (nordnetLines: NordnetLine[]): FikenFile[] => {
  return nordnetLines.reduce<FikenFile[]>((fikenFiles, nordnetLine) => {
    const sign = Math.sign(nordnetLine.beløp);

    const fikenLine: FikenLine = {
      type: nordnetLine.type,
      bokførtDato: nordnetLine.bokførtDato,
      fraKonto: attemptToExtractAccountNumber(nordnetLine.transaksjonstekst),
      tilKonto: nordnetLine.tilKonto,
      isin: nordnetLine.ISIN,
      forklarendeTekst: getForklarendeTekst(nordnetLine),
      inngående: nordnetLine.saldo - nordnetLine.beløp,
      ut: sign === -1 ? Math.abs(nordnetLine.beløp) : 0,
      inn: sign === 1 ? nordnetLine.beløp : 0,
      saldo: nordnetLine.saldo,
      referanse: nordnetLine.referanse,
      source: nordnetLine.source,
      difference: 0,
    };

    const fileName = `nordnet-fiken-${fikenLine.source.year}.${fikenLine.source.month}.csv`;
    const existingFile = fikenFiles.find((f) => f.fileName === fileName);

    if (existingFile) {
      existingFile.rows.push(fikenLine);
    } else {
      fikenFiles.push({ fileName, rows: [fikenLine] });
    }

    return fikenFiles;
  }, []);
};

export const toFikenCsv = (fikenLines: FikenLine[]): Csv => {
  if (fikenLines.length === 0) {
    throw new Error("No lines to convert");
  }

  if (fikenLines.some((line) => line.difference !== 0)) {
    throw new Error("Lines have differences");
  }

  if (fikenLines.some((line) => lineRequiresAccountNumber(line) && (line.fraKonto === null || line.fraKonto.length === 0))) {
    throw new Error("Lines have missing account numbers");
  }

  const rows = fikenLines.map<CsvRow>((fikenLine) => [
    format(fikenLine.bokførtDato, 'yyyy-MM-dd'),
    fikenLine.fraKonto!,
    fikenLine.tilKonto,
    fikenLine.forklarendeTekst,
    fikenLine.isin ?? '',
    formatMoney(fikenLine.inngående),
    formatMoney(fikenLine.ut),
    formatMoney(fikenLine.inn),
    formatMoney(fikenLine.saldo),
    fikenLine.referanse ?? ''
  ]);

  if (rows.some((row) => row.length !== FIKEN_CSV_HEADERS.length)) {
    throw new Error("Rows have different length than headers");
  }

  return { headers: FIKEN_CSV_HEADERS, rows };
};

const lineRequiresAccountNumber = (line: FikenLine): boolean => {
  return line.referanse !== null && line.type === NordnetType.INNSKUDD;
}