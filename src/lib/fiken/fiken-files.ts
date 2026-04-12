import { getKonti } from '@app/lib/fiken/accounts';
import { getForklarendeTekst } from '@app/lib/fiken/text';
import type { FikenLine } from '@app/lib/fiken/types';
import { Money, Sign } from '@app/lib/money';
import type { NordnetLine } from '@app/lib/nordnet/types';
import { createSignal } from 'solid-js';

export const fikenLinesToFikenFiles = (fikenLines: FikenLine[]): FikenFileData[] =>
  fikenLines.reduce<FikenFileData[]>((fikenFiles, fikenLine) => {
    const { year, month, nordnetKonto } = fikenLine;
    const sanitizedAccount = sanitizeAccountName(nordnetKonto);
    const fileName = `nordnet-fiken-${sanitizedAccount}-${year.toString(10)}.${month.toString(10).padStart(2, '0')}.csv`;
    const existingFile = fikenFiles.find((f) => f.fileName === fileName);

    if (existingFile) {
      existingFile.rows.push(fikenLine);
    } else {
      fikenFiles.push({ fileName, month, year, rows: [fikenLine] });
    }

    return fikenFiles;
  }, []);

export const nordnetLinesToFikenLines = (nordnetLines: NordnetLine[]): FikenLine[] =>
  nordnetLines.map(nordnetLineToFikenLine);

const nordnetLineToFikenLine = (nordnetLine: NordnetLine): FikenLine => {
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
  const sign = Money.sign(beløp);
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
    ut: sign === Sign.NEGATIVE ? Money.abs(beløp) : 0n,
    inn: sign !== Sign.NEGATIVE ? beløp : 0n,
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

const sanitizeAccountName = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9æøå-]/g, '');
