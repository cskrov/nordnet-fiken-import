import { getKonti } from "@app/lib/fiken/accounts";
import { getForklarendeTekst } from "@app/lib/fiken/text";
import type { FikenLine } from "@app/lib/fiken/types";
import { type NordnetLine } from "@app/lib/nordnet/types";

export interface FikenFile {
  readonly fileName: string;
  readonly month: number;
  readonly year: number;
  readonly rows: FikenLine[];
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
      forklarendeTekst: getForklarendeTekst(nordnetLine, fraKonto, tilKonto),
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
      fikenFiles.push({ fileName, month, year, rows: [fikenLine] });
    }

    return fikenFiles;
  }, []);
};