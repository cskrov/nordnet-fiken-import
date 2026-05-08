import { serializeFikenCsv, toFikenCsv } from '@/lib/fiken/fiken-csv';
import type { FikenFileData } from '@/lib/fiken/fiken-files';
import { sanitizeAccountName, sanitizeAlias } from '@/lib/fiken/fiken-files';
import type { FikenLine } from '@/lib/fiken/types';
import { pad } from '@/lib/pad-number';

export const downloadFikenLinesCsv = (fikenLines: FikenLine[], fileName: string) => {
  const csv = toFikenCsv(fikenLines);
  const csvContent = serializeFikenCsv(csv);

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
};

export const downloadFikenMapSingleCsv = (fikenLines: FikenLine[], accountAlias?: string | null) => {
  const fileName = getCombinedFileName(fikenLines, accountAlias);

  if (fileName === null) {
    return;
  }

  downloadFikenLinesCsv(fikenLines, fileName);
};

const getCombinedFileName = (fikenLines: FikenLine[], accountAlias?: string | null): string | null => {
  const [firstLine] = fikenLines;
  const lastLine = fikenLines.at(-1);

  if (firstLine === undefined || lastLine === undefined) {
    return null;
  }

  const account = sanitizeAccountName(firstLine.nordnetKonto);
  const aliasPart =
    accountAlias !== undefined && accountAlias !== null && accountAlias.length > 0
      ? `${sanitizeAlias(accountAlias)}-`
      : '';

  return `nordnet-${aliasPart}${account}-${getDateRangeKey(firstLine, lastLine)}.fiken.csv`;
};

const getDateRangeKey = (firstLine: FikenLine, lastLine: FikenLine): string => {
  if (firstLine === lastLine) {
    return `${firstLine.bokførtDato.getFullYear().toString(10)}-${pad(firstLine.bokførtDato.getMonth() + 1)}`;
  }

  const firstYear = firstLine.bokførtDato.getFullYear();
  const firstMonth = firstLine.bokførtDato.getMonth();
  const lastYear = lastLine.bokførtDato.getFullYear();
  const lastMonth = lastLine.bokførtDato.getMonth();

  if (firstYear === lastYear) {
    return `${firstYear.toString(10)}-${pad(firstMonth + 1)}-${pad(lastMonth + 1)}`;
  }

  return `${firstYear.toString(10)}-${pad(firstMonth + 1)}_${lastYear.toString(10)}-${pad(lastMonth + 1)}`;
};

export const downloadFikenMapMultipleCsv = (fikenFiles: FikenFileData[]) => {
  for (const { fileName, rows } of fikenFiles) {
    downloadFikenLinesCsv(rows, fileName);
  }
};
