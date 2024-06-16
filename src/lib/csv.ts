export type CsvData = string[][];

export interface Csv {
  headers: string[];
  rows: CsvData;
}

export interface CsvFile {
  fileName: string;
  data: Csv;
}

const decoder = new TextDecoder("utf-16");

export const parseCsvFiles = async (files: FileList): Promise<CsvFile[]> => {
  const result: CsvFile[] = new Array(files.length);

  let i = 0;

  for (const file of files) {
    const csv = decoder.decode(await file.arrayBuffer());
    const [headers, ...rows] = csv
      .split("\n")
      .filter((row) => row.length !== 0)
      .map((row) => row.split("\t"));

    result[i] = { fileName: file.name, data: { headers, rows } };
    i++;
  }

  return result;
};
