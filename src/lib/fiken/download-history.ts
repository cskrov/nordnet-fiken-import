import { createSignal } from 'solid-js';
import { serializeFikenCsv, toFikenCsv } from '@/lib/fiken/fiken-csv';
import type { FikenFileData } from '@/lib/fiken/fiken-files';

const KEY_PREFIX = 'download-';

interface DownloadRecord {
  hash: string;
  downloadedAt: string;
}

const getStorageKey = (fileName: string): string => `${KEY_PREFIX}${fileName}`;

const signals = new Map<string, ReturnType<typeof createSignal<DownloadRecord | undefined>>>();

const getOrCreateSignal = (fileName: string) => {
  const existing = signals.get(fileName);

  if (existing !== undefined) {
    return existing;
  }

  const initial = loadRecord(fileName);
  const signal = createSignal<DownloadRecord | undefined>(initial);

  signals.set(fileName, signal);

  return signal;
};

const loadRecord = (fileName: string): DownloadRecord | undefined => {
  try {
    const raw = localStorage.getItem(getStorageKey(fileName));

    if (raw === null) {
      return undefined;
    }

    const parsed: unknown = JSON.parse(raw);

    return isDownloadRecord(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const isDownloadRecord = (value: unknown): value is DownloadRecord =>
  value !== null &&
  typeof value === 'object' &&
  'hash' in value &&
  typeof value.hash === 'string' &&
  'downloadedAt' in value &&
  typeof value.downloadedAt === 'string';

export const getDownloadRecord = (fileName: string): DownloadRecord | undefined => {
  const [record] = getOrCreateSignal(fileName);

  return record();
};

export const markAsDownloaded = async (
  fikenFile: FikenFileData,
  downloadedAt = new Date().toISOString(),
): Promise<void> => {
  const hash = await computeContentHash(fikenFile);

  if (hash === null) {
    console.warn(`Could not compute content hash for file ${fikenFile.fileName}. Download record will not be saved.`);
    return;
  }

  const record: DownloadRecord = { hash, downloadedAt };
  const [, setRecord] = getOrCreateSignal(fikenFile.fileName);
  setRecord(record);
  localStorage.setItem(getStorageKey(fikenFile.fileName), JSON.stringify(record));
};

export const markAllAsDownloaded = async (fikenFiles: FikenFileData[]): Promise<void> => {
  const downloadedAt = new Date().toISOString();
  await Promise.all(fikenFiles.map((fikenFile) => markAsDownloaded(fikenFile, downloadedAt)));
};

export const computeContentHash = async (fikenFile: FikenFileData): Promise<string | null> => {
  try {
    const csv = toFikenCsv(fikenFile.rows);
    return await hashString(serializeFikenCsv(csv));
  } catch {
    return null;
  }
};

const hashString = async (str: string): Promise<string> => {
  const data = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer).toBase64();
};
