const getAccountNumberStorageKey = (referanse: string): string => `account-${referanse}`;

export const getLocalStorageAccountNumber = (referanse: string): string | null => localStorage.getItem(getAccountNumberStorageKey(referanse));

export const setLocalStorageAccountNumber = (referanse: string, accountNumber: string): void => localStorage.setItem(getAccountNumberStorageKey(referanse), accountNumber);

export const removeLocalStorageAccountNumber = (referanse: string): void => localStorage.removeItem(getAccountNumberStorageKey(referanse));

export const ACCOUNT_NUMBER_REGEX = /[0-9]{8,11}$/;

export const attemptToExtractAccountNumber = (text: string): string | null => {
  const match = text.match(ACCOUNT_NUMBER_REGEX);

  return match ? match[0] : null;
}