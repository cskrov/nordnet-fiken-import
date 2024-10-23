import { toFikenCsv, type FikenFile, type FikenLine } from "@app/lib/fiken";
import { pad } from "@app/lib/pad-number";
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
    return `${firstYear.toString(10)}.${pad(firstMonth + 1)}-${pad(lastMonth + 1)}`;
  }

  return `${firstYear.toString(10)}.${pad(firstMonth + 1)}-${lastYear.toString(10)}.${pad(lastMonth + 1)}`;
}

export const downloadFikenMapMultipleCsv = (fikenFiles: FikenFile[]) => {
  for (const { fileName, rows } of fikenFiles) {
    downloadFikenLinesCsv(rows, fileName);
  }
};
