export type Money = number;

const INTEGER_REGEX = /^[0-9]+$/;

/**
 * @returns A whole number representing the value in øre.
 */
export const parseMoney = (value: string): Money => {
  const isNegative = value.startsWith('-');
  const [integer = '0', decimal = '0'] = value.replace('-', '').replaceAll(' ', '').split(',');

  if (!INTEGER_REGEX.test(integer)) {
    throw new Error(`Invalid integer: ${integer}`);
  }

  if (!INTEGER_REGEX.test(decimal)) {
    throw new Error(`Invalid decimal: ${decimal}`);
  }

  const parsedInteger = Number.parseInt(integer, 10);

  if (Number.isNaN(parsedInteger)) {
    throw new Error(`Failed to parse integer: ${integer}`);
  }

  const parsedDecimal = Number.parseInt(decimal, 10);

  if (Number.isNaN(parsedDecimal)) {
    throw new Error(`Failed to parse decimal: ${decimal}`);
  }

  if (parsedInteger === 0) {
    return isNegative ? -parsedDecimal : parsedDecimal;
  }

  const parsed = parsedInteger * 100 + parsedDecimal;

  return isNegative ? -parsed : parsed;
};

const splitMoney = (value: Money): [number, number] => {
  const integer = Math.trunc(value / 100);
  const decimal = Math.abs(value) % 100;

  return [integer, decimal];
};

export const formatMoney = (value: Money): string => {
  const [integer, decimal] = splitMoney(value);

  return `${integer.toString(10)},${decimal.toString(10).padEnd(2, '0')}`;
};

// "minimumFractionDigits: 2" does not work in Bun (unit tests).
const FORMATTER = Intl.NumberFormat('nb-NO', {
  style: 'decimal',
  useGrouping: true,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const prettyFormatMoney = (value: Money): string => {
  const [integer, decimal] = splitMoney(value);

  return `${FORMATTER.format(integer)},${decimal.toString(10).padEnd(2, '0')} kr`;
};
