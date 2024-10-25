import { getKonti } from '@app/lib/fiken/accounts';
import { getForklarendeTekst } from '@app/lib/fiken/text';
import type { FikenLine } from '@app/lib/fiken/types';
import type { NordnetLine } from '@app/lib/nordnet/types';
import { createSignal } from 'solid-js';

export interface NordnetMonth {
  readonly month: number;
  readonly year: number;
  readonly rows: NordnetLine[];
}

export const groupByMonth = (nordnetLines: NordnetLine[]): NordnetMonth[] =>
  nordnetLines.reduce<NordnetMonth[]>((nordnetMonths, nordnetLine) => {
    const { month, year } = nordnetLine;
    const existingFile = nordnetMonths.find((m) => m.year === year && m.month === month);

    if (existingFile) {
      existingFile.rows.push(nordnetLine);
    } else {
      nordnetMonths.push({ year, month, rows: [nordnetLine] });
    }

    return nordnetMonths;
  }, []);

export const fikenLinesToFikenFiles = (fikenLines: FikenLine[]): FikenFileData[] =>
  fikenLines.reduce<FikenFileData[]>((fikenFiles, fikenLine) => {
    const { year, month } = fikenLine;
    const fileName = `nordnet-fiken-${year.toString(10)}.${month.toString(10).padStart(2, '0')}.csv`;
    const existingFile = fikenFiles.find((f) => f.fileName === fileName);

    if (existingFile) {
      existingFile.rows.push(fikenLine);
    } else {
      fikenFiles.push({ fileName, month, year, rows: [fikenLine] });
    }

    return fikenFiles;
  }, []);

export const nordnetMonthToFikenMonth = ({ year, month, rows }: NordnetMonth): FikenFileData => ({
  fileName: `nordnet-fiken-${year.toString(10)}.${month.toString(10).padStart(2, '0')}.csv`,
  year,
  month,
  rows: rows.map(nordnetLineToFikenLine),
});

export const nordnetLinesToFikenLines = (nordnetLines: NordnetLine[]): FikenLine[] =>
  nordnetLines.map(nordnetLineToFikenLine);

export const nordnetLineToFikenLine = (nordnetLine: NordnetLine): FikenLine => {
  const {
    id,
    transaksjonstype,
    portefølje,
    bokførtDato,
    beløp,
    saldo,
    ISIN,
    month,
    year,
    source,
    generated,
    unexpectedSaldo,
  } = nordnetLine;
  const sign = Math.sign(beløp);
  const nordnetKonti = getKonti(nordnetLine);
  const [fraKonto, setFraKonto] = createSignal<string | null>(nordnetKonti.fraKonto);
  const [tilKonto, setTilKonto] = createSignal<string | null>(nordnetKonti.tilKonto);

  return {
    type: transaksjonstype,
    bokførtDato,
    fraKonto,
    setFraKonto,
    tilKonto,
    setTilKonto,
    nordnetKonto: portefølje,
    isin: ISIN,
    forklarendeTekst: () => getForklarendeTekst(nordnetLine, fraKonto(), tilKonto()),
    inngående: saldo - beløp,
    ut: sign === -1 ? Math.abs(beløp) : 0,
    inn: sign === 1 ? beløp : 0,
    saldo,
    referanse: id,
    month,
    year,
    source,
    generated,
    unexpectedSaldo,
  };
};

export interface FikenFileData {
  readonly fileName: string;
  readonly month: number;
  readonly year: number;
  readonly rows: FikenLine[];
}
