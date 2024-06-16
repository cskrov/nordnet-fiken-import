export enum NordnetType {
  INNSKUDD = "INNSKUDD",
  UTTAK = "UTTAK",
  SALDO = "SALDO",
  PLATTFORMAVGIFT = "PLATTFORMAVGIFT",
  KJØPT = "KJØPT",
  SOLGT = "SOLGT",
  DEBETRENTE = "DEBETRENTE",
  OVERBELÅNINGSRENTE = "OVERBELÅNINGSRENTE",
  UKJENT = "UKJENT"
}

export const NORDNET_TYPES = Object.values(NordnetType);

export const isNordnetType = (type: string): type is NordnetType => NORDNET_TYPES.some(t => t === type);

export interface RawNordnetLine {
  readonly id: string | null;
  readonly bokførtDato: Date;
  readonly portefølje: string;
  readonly transaksjonstype: string;
  readonly beløp: number;
  readonly saldo: number;
  readonly transaksjonstekst: string;
  readonly verdipapir: string | null;
  readonly ISIN: string | null;
  readonly source: NordnetLineSource;
}

export interface NordnetLineSource {
  readonly fileName: string | null;
  readonly rowNumber: number;
  readonly year: number;
  readonly month: number;
}

export enum NordnetErrorType {
  UKJENT_TYPE = "UKJENT_TYPE",
  SALDO_MISMATCH = "SALDO_MISMATCH"
}

export interface UkjentTypeError {
  readonly errorType: NordnetErrorType.UKJENT_TYPE;
  readonly transaksjonstype: string;
}

export interface SaldoMismatchError {
  readonly errorType: NordnetErrorType.SALDO_MISMATCH;
  readonly previousLine: NordnetLine;
  readonly line: NordnetLine;
}

export type NordnetError = UkjentTypeError | SaldoMismatchError;

export interface NordnetLine {
  readonly tilKonto: string;
  readonly bokførtDato: Date;
  readonly beløp: number;
  readonly saldo: number;
  readonly transaksjonstekst: string;
  readonly referanse: string | null;
  readonly type: NordnetType;
  readonly verdipapir: string | null;
  readonly ISIN: string | null;
  readonly source: NordnetLineSource;
  readonly errors: NordnetError[];
}

export type NordnetKey = `${string}-${string}`;

export type NordnetMap = Map<NordnetKey, (NordnetLine | NordnetError)[]>;