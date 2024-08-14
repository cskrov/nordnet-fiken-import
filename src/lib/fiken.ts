import type { Csv, CsvRow } from "@app/lib/csv";
import { formatMoney } from "@app/lib/money";
import { isNordnetType, NordnetType, type NordnetLine, type NordnetLineSource } from "@app/lib/nordnet/types";
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

export const FIKEN_TABLE_HEADERS = [...FIKEN_CSV_HEADERS, "Fra fil (linje)"];

interface BaseFikenLine {
  readonly type: NordnetType | string;
  fraKonto: string | null;
  readonly tilKonto: string | null;
  readonly isin: string | null;
  readonly bokførtDato: Date;
  readonly forklarendeTekst: string;
  readonly inngående: number;
  readonly ut: number;
  readonly inn: number;
  readonly saldo: number;
  readonly referanse: string;
  readonly month: number;
  readonly year: number;
  readonly source: NordnetLineSource;
  readonly generated: boolean;
}

interface FikenLineInnskudd extends BaseFikenLine {
  readonly type: NordnetType.INNSKUDD;
  readonly referanse: string;
}

export type FikenLine = FikenLineInnskudd | BaseFikenLine;

export const isInnskuddLine = (line: FikenLine): line is FikenLineInnskudd => line.type === NordnetType.INNSKUDD;

export interface FikenFile {
  readonly fileName: string;
  readonly rows: FikenLine[];
}

const getForklarendeTekst = (nordnetLine: NordnetLine, fraKonto: string | null): string => {
  switch (nordnetLine.transaksjonstype) {
    case NordnetType.KJØPT:
      return `Kjøp av ${nordnetLine.verdipapir} (${nordnetLine.ISIN})`;
    case NordnetType.SALG:
      return `Salg av ${nordnetLine.verdipapir} (${nordnetLine.ISIN})`;
    case NordnetType.DEBETRENTE:
      return "Debetrente";
    case NordnetType.OVERBELÅNINGSRENTE:
      return "Overbelåningsrente";
    case NordnetType.UTTAK:
      return nordnetLine.transaksjonstekst;
    case NordnetType.INNSKUDD: {
      if (fraKonto === null || ACCOUNT_NUMBER_REGEX.test(nordnetLine.transaksjonstekst)) {
        return nordnetLine.transaksjonstekst;
      }

      return `Innskudd KID fra ${fraKonto}`;
    }
  }

  return nordnetLine.transaksjonstekst;
}

const ACCOUNT_NUMBER_REGEX = /[0-9]{8,11}$/;

const attemptToExtractAccountNumber = (text: string): string | null => {
  const match = text.match(ACCOUNT_NUMBER_REGEX);

  return match ? match[0] : null;
}

export const toFikenFiles = (nordnetLines: NordnetLine[]): FikenFile[] => {
  return nordnetLines.reduce<FikenFile[]>((fikenFiles, nordnetLine) => {
    const { id, transaksjonstype, bokførtDato, beløp, saldo, ISIN, month, year, source, generated } = nordnetLine;
    const sign = Math.sign(beløp);
    const { fraKonto, tilKonto } = getKonti(nordnetLine);

    const fikenLine: FikenLine = {
      type: transaksjonstype,
      bokførtDato: bokførtDato,
      fraKonto,
      tilKonto,
      isin: ISIN,
      forklarendeTekst: getForklarendeTekst(nordnetLine, fraKonto),
      inngående: saldo - beløp,
      ut: sign === -1 ? Math.abs(beløp) : 0,
      inn: sign === 1 ? beløp : 0,
      saldo: saldo,
      referanse: id,
      month: month,
      year: year,
      source: source,
      generated: generated
    };

    const fileName = `nordnet-fiken-${fikenLine.year.toString(10)}.${fikenLine.month.toString(10).padStart(2, '0')}.csv`;
    const existingFile = fikenFiles.find((f) => f.fileName === fileName);

    if (existingFile) {
      existingFile.rows.push(fikenLine);
    } else {
      fikenFiles.push({ fileName, rows: [fikenLine] });
    }

    return fikenFiles;
  }, []);
};

const getKonti = ({ transaksjonstype, portefølje, transaksjonstekst, beløp }: NordnetLine): Pick<BaseFikenLine, 'fraKonto' | 'tilKonto'> => {
  if (isNordnetType(transaksjonstype)) {
    switch (transaksjonstype) {
      case NordnetType.INNSKUDD:
        return { fraKonto: attemptToExtractAccountNumber(transaksjonstekst), tilKonto: portefølje };
      case NordnetType.KJØPT:
        return { fraKonto: portefølje, tilKonto: portefølje };
      case NordnetType.SALG:
        return { fraKonto: portefølje, tilKonto: portefølje };
      case NordnetType.SALDO:
        return { fraKonto: portefølje, tilKonto: portefølje };
      case NordnetType.DEBETRENTE:
        return beløp < 0 ? { fraKonto: portefølje, tilKonto: null } : { fraKonto: null, tilKonto: portefølje };
      case NordnetType.OVERBELÅNINGSRENTE:
        return { fraKonto: portefølje, tilKonto: null };
      case NordnetType.PLATTFORMAVGIFT:
        return { fraKonto: portefølje, tilKonto: null };
      case NordnetType.UTTAK:
        return { fraKonto: portefølje, tilKonto: attemptToExtractAccountNumber(transaksjonstekst) };
      case NordnetType.UKJENT:
        return { fraKonto: null, tilKonto: null };
    }
  }

  return { fraKonto: null, tilKonto: null };
};

export const toFikenCsv = (fikenLines: FikenLine[]): Csv => {
  if (fikenLines.length === 0) {
    throw new Error("Ingen linjer å laste ned.");
  }

  if (fikenLines.some((line) => lineRequiresAccountNumber(line) && (line.fraKonto === null || line.fraKonto.length === 0))) {
    throw new Error("Én eller flere linjer mangler kontonummer.");
  }

  const rows = fikenLines.map<CsvRow>(({ bokførtDato, fraKonto, tilKonto, forklarendeTekst, isin, inngående, ut, inn, saldo, referanse }) => [
    format(bokførtDato, 'yyyy-MM-dd'),
    fraKonto!,
    tilKonto ?? '',
    forklarendeTekst,
    isin ?? '',
    formatMoney(inngående),
    formatMoney(ut),
    formatMoney(inn),
    formatMoney(saldo),
    referanse,
  ]);

  if (rows.some((row) => row.length !== FIKEN_CSV_HEADERS.length)) {
    throw new Error("Unexpected technical error: One or more rows have different length than headers.");
  }

  return { headers: FIKEN_CSV_HEADERS, rows };
};

const lineRequiresAccountNumber = (line: FikenLine): boolean => {
  return line.referanse !== null && line.type === NordnetType.INNSKUDD;
}