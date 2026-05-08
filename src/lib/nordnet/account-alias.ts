export enum AccountType {
  AF = 0,
  SPK = 1,
}

export const ACCOUNT_TYPE_NAMES: Record<AccountType, string> = {
  [AccountType.AF]: 'Aksje- og fondskonto',
  [AccountType.SPK]: 'Sparekonto',
};

export const ACCOUNT_TYPES = [AccountType.AF, AccountType.SPK] as const;

const NAME_KEY_PREFIX = 'account-name-';

const getNameStorageKey = (accountNumber: string): string => `${NAME_KEY_PREFIX}${accountNumber}`;

export const getAccountName = (accountNumber: string): string | null =>
  localStorage.getItem(getNameStorageKey(accountNumber));

export const setAccountName = (accountNumber: string, name: string): void =>
  localStorage.setItem(getNameStorageKey(accountNumber), name);

export const removeAccountName = (accountNumber: string): void =>
  localStorage.removeItem(getNameStorageKey(accountNumber));
