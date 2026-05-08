import { createSignal } from 'solid-js';
import { serializeFikenCsv, toFikenCsv } from '@/lib/fiken/fiken-csv';
import type { FikenFileData } from '@/lib/fiken/fiken-files';
import { pad } from '@/lib/pad-number';

const KEY_PREFIX = 'download-';
const OLD_KEY_PATTERN = /^download-nordnet-fiken-(.+)-(\d{4})\.(\d{2})\.csv$/;

const migrateOldKeys = () => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);

    if (key === null) {
      continue;
    }

    const match = OLD_KEY_PATTERN.exec(key);

    if (match === null) {
      continue;
    }

    const [, account, yearStr, monthStr] = match;

    if (account === undefined || yearStr === undefined || monthStr === undefined) {
      continue;
    }

    const newKey = `${KEY_PREFIX}${account}-${yearStr}-${monthStr}`;

    if (localStorage.getItem(newKey) === null) {
      const value = localStorage.getItem(key);

      if (value !== null) {
        localStorage.setItem(newKey, value);
      }
    }

    localStorage.removeItem(key);
  }
};

migrateOldKeys();

interface DownloadRecord {
  hash: string;
  downloadedAt: string;
}

const getStorageKey = (accountNumber: string, year: number, month: number): string =>
  `${KEY_PREFIX}${accountNumber}-${year.toString(10)}-${pad(month)}`;

const signals = new Map<string, ReturnType<typeof createSignal<DownloadRecord | undefined>>>();

const getOrCreateSignal = (accountNumber: string, year: number, month: number) => {
  const key = getStorageKey(accountNumber, year, month);
  const existing = signals.get(key);

  if (existing !== undefined) {
    return existing;
  }

  const initial = loadRecord(accountNumber, year, month);
  const signal = createSignal<DownloadRecord | undefined>(initial);

  signals.set(key, signal);

  return signal;
};

const loadRecord = (accountNumber: string, year: number, month: number): DownloadRecord | undefined => {
  try {
    const raw = localStorage.getItem(getStorageKey(accountNumber, year, month));

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

export const getDownloadRecord = (fikenFile: FikenFileData): DownloadRecord | undefined => {
  const [record] = getOrCreateSignal(fikenFile.accountNumber, fikenFile.year, fikenFile.month);

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
  const [, setRecord] = getOrCreateSignal(fikenFile.accountNumber, fikenFile.year, fikenFile.month);
  setRecord(record);
  localStorage.setItem(getStorageKey(fikenFile.accountNumber, fikenFile.year, fikenFile.month), JSON.stringify(record));
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
