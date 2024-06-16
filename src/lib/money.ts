export type Money = number;

const INTEGER_REGEX = /^[0-9]+$/;

/**
 * @returns A whole number representing the value in øre.
*/
export const parseMoney = (value: string): Money => {
  const isNegative = value.startsWith('-');
  const [integer = "0", decimal = "0"] = value.replace('-', '').replaceAll(' ', '').split(",");

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

  const parsed = (parsedInteger * 100 + parsedDecimal);

  return isNegative ? -parsed : parsed;
}

const splitMoney = (value: Money): [number, number] => {
  const integer = Math.trunc(value / 100); // Math.floor(-0.1) === -1
  const decimal = Math.abs(value) % 100;

  return [integer, decimal];
}

export const formatMoney = (value: Money): string => {
  const [integer, decimal] = splitMoney(value);

  return `${integer.toString(10)},${decimal.toString(10).padStart(2, '0')}`;
}

export const prettyFormatMoney = (value: Money): string => {
  const sign = Math.sign(value);
  const [integer, decimal] = splitMoney(value);

  const integerString = Math.abs(integer).toString(10).split('').toReversed().map((n, i) => i % 3 === 0 ? `${n} ` : n).toReversed().join('').trim();

  return `${sign === -1 ? '-' : ''}${integerString},${decimal.toString(10).padStart(2, '0')} kr`;
};
