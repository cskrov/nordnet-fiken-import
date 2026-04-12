const NAME_KEY_PREFIX = 'account-name-';

const getNameStorageKey = (accountNumber: string): string => `${NAME_KEY_PREFIX}${accountNumber}`;

export const getAccountName = (accountNumber: string): string | null =>
  localStorage.getItem(getNameStorageKey(accountNumber));

export const setAccountName = (accountNumber: string, name: string): void =>
  localStorage.setItem(getNameStorageKey(accountNumber), name);

export const removeAccountName = (accountNumber: string): void =>
  localStorage.removeItem(getNameStorageKey(accountNumber));
