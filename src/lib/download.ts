import { toFikenCsv, type FikenLine, type FikenMap } from "$lib/fiken";
import type { NordnetKey } from "$lib/nordnet/types";
import { format, parse } from "date-fns";

export const downloadFikenLinesCsv = (fikenLines: FikenLine[], key: string) => {
  const csv = toFikenCsv(fikenLines);
  const csvContent = [
    csv.headers.join(";"),
    ...csv.rows.map(row => row.join(";"))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `nordnet-fiken-${key}.csv`;
  a.click();
};

export const downloadFikenMapSingleCsv = (sortedFikenMonths: [NordnetKey, FikenLine[]][]) => {
  const filteredFikenMonths = sortedFikenMonths.filter(([, lines]) => lines.every(l => l.difference === 0));

  if (filteredFikenMonths.length === 0) {
    return;
  }

  const firstMonth = filteredFikenMonths.at(0);

  if (firstMonth !== undefined && filteredFikenMonths.length === 1) {
    const [key, lines] = firstMonth;
    downloadFikenLinesCsv(lines, formatKey(key));
    return;
  }

  const lastMonth = filteredFikenMonths.at(-1);

  if (lastMonth !== undefined && firstMonth !== undefined) {
    const key = `${formatKey(firstMonth[0])}-${formatKey(lastMonth[0])}`;
    const lines = filteredFikenMonths.flatMap(([, lines]) => lines);
    downloadFikenLinesCsv(lines, key);
    return;
  }
};

export const downloadFikenMapMultipleCsv = (fikenMap: FikenMap) => {
  for (const [key, lines] of fikenMap.entries()) {
    if (lines.every(l => l.difference === 0)) {
      downloadFikenLinesCsv(lines, formatKey(key));
    }
  }
};

const formatKey = (key: `${string}-${string}`) => {
  const parsedKey = parse(key, 'yyyy-MM', new Date());
  return format(parsedKey, 'yyyy.MM');
};
