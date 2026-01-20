export enum NordnetType {
  INNSKUDD = 'INNSKUDD',
  UTTAK = 'UTTAK INTERNET',
  SALDO = 'SALDO',
  PLATTFORMAVGIFT = 'PLATTFORMAVGIFT',
  PLATTFORMAVG_KORR = 'PLATTFORMAVG KORR',
  KJØPT = 'KJØPT',
  SALG = 'SALG',
  DEBETRENTE = 'DEBETRENTE',
  OVERBELÅNINGSRENTE = 'OVERBELÅNINGSRENTE',
  TILBAKEBETALING_FOND_AVG = 'TILBAKEBET. FOND AVG',
  MVA = 'MVA',
  OPPBEVARING_NORDISKE_UNOTERTE = 'OPPBEVARING NORDISKE UNOTERTE',
  TILBAKEBETALING = 'TILBAKEBETALING',
}

export const NORDNET_TYPES = Object.values(NordnetType);

export const isNordnetType = (type: string): type is NordnetType => NORDNET_TYPES.some((t) => t === type);

export interface NordnetLineSource {
  readonly fileName: string | null;
  readonly rowNumber: number;
}

export interface NordnetLine {
  readonly id: string;
  readonly bokførtDato: Date;
  readonly portefølje: string;
  readonly transaksjonstype: string;
  readonly beløp: bigint;
  readonly saldo: bigint;
  readonly transaksjonstekst: string;
  readonly verdipapir: string | null;
  readonly ISIN: string | null;
  readonly year: number;
  readonly month: number;
  readonly source: NordnetLineSource;
  readonly generated: boolean;
  readonly unexpectedSaldo: boolean;
}

export type NordnetKey = `${string}-${string}`;

export type NordnetMap = Map<NordnetKey, NordnetLine[]>;
