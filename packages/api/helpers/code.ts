import { VERIFICATION_CODE_LENGTH } from '@shared/constants';

export const generateVerificationCode = () => _generateVerificationCode(VERIFICATION_CODE_LENGTH);

const _generateVerificationCode = (digits: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16) =>
  Math.floor(Math.random() * 10 ** digits)
    .toString(10)
    .padStart(digits, '0');
