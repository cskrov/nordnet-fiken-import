import { createSignal } from 'solid-js';
import { getKonti } from '@/lib/fiken/accounts';
import { getForklarendeTekst } from '@/lib/fiken/text';
import type { FikenLine } from '@/lib/fiken/types';
import { Money, Sign } from '@/lib/money';
import type { NordnetLine } from '@/lib/nordnet/types';
import { pad } from '@/lib/pad-number';

const buildFileName = (account: string, year: number, month: number | null, alias?: string | null): string => {
  const parts = ['nordnet'];

  if (alias !== undefined && alias !== null && alias.length > 0) {
    parts.push(sanitizeAlias(alias));
  }

  parts.push(sanitizeAccountName(account));
  parts.push(year.toString(10));

  if (month !== null) {
    parts.push(pad(month));
  }

  return `${parts.join('-')}.fiken.csv`;
};

export const fikenLinesToFikenFiles = (fikenLines: FikenLine[], accountAlias?: string | null): FikenFileData[] =>
  fikenLines.reduce<FikenFileData[]>((fikenFiles, fikenLine) => {
    const { year, month, nordnetKonto } = fikenLine;
    const fileName = buildFileName(nordnetKonto, year, month, accountAlias);
    const existingFile = fikenFiles.find((f) => f.fileName === fileName);

    if (existingFile) {
      existingFile.rows.push(fikenLine);
    } else {
      fikenFiles.push({ fileName, accountNumber: nordnetKonto, month, year, rows: [fikenLine] });
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
    unknownType,
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
    unknownType,
  };
};

export interface FikenFileData {
  readonly fileName: string;
  readonly accountNumber: string;
  readonly month: number;
  readonly year: number;
  readonly rows: FikenLine[];
}

const UNICODE_WHITESPACE = /\p{Z}+/gu;
const ACCOUNT_NAME_DISALLOWED = /[^a-z0-9æøå-]/gu;
const ALIAS_DISALLOWED = /[^a-z0-9æøå_-]/gu;

export const sanitizeAccountName = (name: string): string =>
  name.trim().toLowerCase().replaceAll(UNICODE_WHITESPACE, '-').replaceAll(ACCOUNT_NAME_DISALLOWED, '');

export const sanitizeAlias = (alias: string): string =>
  alias.trim().toLowerCase().replaceAll(UNICODE_WHITESPACE, '_').replaceAll(ALIAS_DISALLOWED, '');
