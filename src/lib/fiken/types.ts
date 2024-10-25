import type { NordnetLineSource, NordnetType } from '@app/lib/nordnet/types';
import type { Accessor } from 'solid-js';

export interface BaseFikenLine {
  readonly type: NordnetType | string;
  readonly fraKonto: Accessor<string | null>;
  readonly setFraKonto: (value: string | null) => void;
  readonly tilKonto: Accessor<string | null>;
  readonly setTilKonto: (value: string | null) => void;
  readonly isin: string | null;
  readonly nordnetKonto: string;
  readonly bokførtDato: Date;
  readonly forklarendeTekst: Accessor<string>;
  readonly inngående: number;
  readonly ut: number;
  readonly inn: number;
  readonly saldo: number;
  readonly referanse: string;
  readonly month: number;
  readonly year: number;
  readonly source: NordnetLineSource;
  readonly generated: boolean;
  readonly unexpectedSaldo: boolean;
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
