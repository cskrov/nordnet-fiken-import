export enum Sign {
  POSITIVE = 1,
  NEGATIVE = -1,
  ZERO = 0,
}

export namespace Money {
  export const abs = (value: bigint): bigint => (value < 0n ? -value : value);

  export const sign = (value: bigint, reverse = false): Sign => {
    if (value > 0) {
      return reverse ? Sign.NEGATIVE : Sign.POSITIVE;
    }

    if (value < 0) {
      return reverse ? Sign.POSITIVE : Sign.NEGATIVE;
    }

    return Sign.ZERO;
  };
}

const INTEGER_REGEX = /^[0-9]+$/;

export const RESOLUTION_DIGITS = 10;
export const RESOLUTION = 10n ** BigInt(RESOLUTION_DIGITS);

/**
 * Parses a money string (Norwegian format with spaces and commas) into a BigInt
 * with a fixed decimal points resolution.
 *
 * @param value - The money string (e.g., "200 000,56", "-1,08")
 * @returns A BigInt representing the value scaled to a fixed number of decimal places
 */
export const parseMoney = (value: string): bigint => {
  const isNegative = value.startsWith('-');
  const [integer = '0', decimal = ''] = value.replace('-', '').replaceAll(' ', '').split(',');

  if (!INTEGER_REGEX.test(integer)) {
    throw new Error(`Invalid integer: ${integer}`);
  }

  const parsedInteger = BigInt(integer);
  const parsedDecimal = parseDecimal(decimal);
  const parsed = parsedInteger * RESOLUTION + parsedDecimal;

  return isNegative ? -parsed : parsed;
};

/**
 * Parses a decimal string (the part after the comma) into a BigInt
 * with a fixed decimal points resolution.
 *
 * @param decimal - The decimal part as a string (e.g., "56", "008", "012")
 * @returns A BigInt representing the decimal value scaled to a fixed number of decimal places
 */
export const parseDecimal = (decimal: string): bigint => {
  if (decimal.length === 0) {
    return 0n;
  }

  if (!INTEGER_REGEX.test(decimal)) {
    throw new Error(`Invalid decimal: ${decimal}`);
  }

  // If decimal has more digits than our resolution, we need to truncate and round
  if (decimal.length > RESOLUTION_DIGITS) {
    // Take the first RESOLUTION_DIGITS digits
    const truncated = decimal.slice(0, RESOLUTION_DIGITS);
    const parsedValue = BigInt(truncated);

    // Check the next digit for rounding
    const nextDigit = decimal[RESOLUTION_DIGITS];
    const parsedNextDigit = nextDigit === undefined ? 0 : Number.parseInt(nextDigit, 10);

    return parsedNextDigit >= 5 ? parsedValue + 1n : parsedValue;
  }

  const parsedValue = BigInt(decimal);

  // Scale the parsed value to the correct position within 10 decimal places
  // e.g., "56" (length 2) → 56 * 10^8 = 5_600_000_000
  // e.g., "008" (length 3) → 8 * 10^7 = 80_000_000
  return parsedValue * 10n ** BigInt(RESOLUTION_DIGITS - decimal.length);
};

export const formatMoney = (value: bigint): string => {
  const isNegative = value < 0n;
  const [integer, decimal] = splitMoney(value);
  const sign = isNegative && integer === 0n ? '-' : '';

  return `${sign}${integer.toString(10)},${formatDecimal(decimal)}`;
};

const FORMATTER = Intl.NumberFormat('nb-NO', {
  style: 'decimal',
  useGrouping: true,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const prettyFormatMoney = (value: bigint): string => {
  const isNegative = value < 0n;
  const [integer, decimal] = splitMoney(value);
  const sign = isNegative && integer === 0n ? '−' : '';

  return `${sign}${FORMATTER.format(integer)},${formatDecimal(decimal)} kr`;
};

const splitMoney = (value: bigint): [bigint, bigint] => {
  const integer = value / RESOLUTION;
  const decimal = Money.abs(value % RESOLUTION);

  return [integer, decimal];
};

const TRAILING_ZEROS_REGEX = /0+$/g;

const formatDecimal = (decimal: bigint): string =>
  decimal.toString(10).padStart(RESOLUTION_DIGITS, '0').replaceAll(TRAILING_ZEROS_REGEX, '').padStart(2, '0');
