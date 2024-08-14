export enum NordnetType {
  INNSKUDD = "INNSKUDD",
  UTTAK = "UTTAK INTERNET",
  SALDO = "SALDO",
  PLATTFORMAVGIFT = "PLATTFORMAVGIFT",
  KJØPT = "KJØPT",
  SALG = "SALG",
  DEBETRENTE = "DEBETRENTE",
  OVERBELÅNINGSRENTE = "OVERBELÅNINGSRENTE",
  UKJENT = "UKJENT"
}

export const NORDNET_TYPES = Object.values(NordnetType);

export const isNordnetType = (type: string): type is NordnetType => NORDNET_TYPES.some(t => t === type);

export interface NordnetLineSource {
  readonly fileName: string | null;
  readonly rowNumber: number;
}

export interface NordnetLine {
  readonly id: string;
  readonly bokførtDato: Date;
  readonly portefølje: string;
  readonly transaksjonstype: string;
  readonly beløp: number;
  readonly saldo: number;
  readonly transaksjonstekst: string;
  readonly verdipapir: string | null;
  readonly ISIN: string | null;
  readonly year: number;
  readonly month: number;
  readonly source: NordnetLineSource;
  readonly generated: boolean;
}

export type NordnetKey = `${string}-${string}`;

export type NordnetMap = Map<NordnetKey, NordnetLine[]>;