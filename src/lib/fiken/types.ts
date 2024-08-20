import { NordnetType, type NordnetLineSource } from "@app/lib/nordnet/types";

export interface BaseFikenLine {
  readonly type: NordnetType | string;
  fraKonto: string | null;
  tilKonto: string | null;
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

export interface FikenLineInnskudd extends BaseFikenLine {
  readonly type: NordnetType.INNSKUDD;
  readonly referanse: string;
}

export interface FikenLineUttak extends BaseFikenLine {
  readonly type: NordnetType.UTTAK;
  readonly referanse: string;
}

export type FikenLine = FikenLineInnskudd | FikenLineUttak | BaseFikenLine;