import { toFikenCsv, type FikenFile, type FikenLine } from "@app/lib/fiken";
import { format } from "date-fns";

export const downloadFikenLinesCsv = (fikenLines: FikenLine[], fileName: string) => {
  const csv = toFikenCsv(fikenLines);
  const csvContent = [
    csv.headers.join(";"),
    ...csv.rows.map(row => row.join(";"))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
};

export const downloadFikenMapSingleCsv = (fikenLines: FikenLine[]) => {
  const [firstLine] = fikenLines;
  const lastLine = fikenLines.at(-1);

  if (firstLine === undefined || lastLine === undefined) {
    return;
  }

  downloadFikenLinesCsv(fikenLines, `nordnet-fiken-${getKey(firstLine, lastLine)}.csv`);
};

const getKey = (firstLine: FikenLine, lastLine: FikenLine) => {
  if (firstLine === lastLine) {
    return format(firstLine.bokførtDato, "yyyy.MM");
  }

  const firstYear = firstLine.bokførtDato.getFullYear();
  const firstMonth = firstLine.bokførtDato.getMonth();
  const lastYear = lastLine.bokførtDato.getFullYear();
  const lastMonth = lastLine.bokførtDato.getMonth();

  if (firstYear === lastYear) {
    return `${firstYear}.${firstMonth + 1}-${lastMonth + 1}`;
  }

  return `${firstYear}.${firstMonth + 1}-${lastYear}.${lastMonth + 1}`;
}

export const downloadFikenMapMultipleCsv = (fikenFiles: FikenFile[]) => {
  for (const { fileName, rows } of fikenFiles) {
    if (rows.every(l => l.difference === 0)) {
      downloadFikenLinesCsv(rows, fileName);
    }
  }
};
