import { describe, expect, it } from 'bun:test';
import { formatMoney, parseDecimal, parseMoney, prettyFormatMoney, RESOLUTION } from '@app/lib/money';

const SUCCESS_PARSE_MONEY_TESTS: [string, bigint][] = [
  ['2 000 000 500 321 001', 2_000_000_500_321_001n * RESOLUTION],
  ['-2 000 000 500 321 001', -2_000_000_500_321_001n * RESOLUTION],
  ['2 000 000 500 321 001,0000000001', 2_000_000_500_321_001n * RESOLUTION + 1n],
  ['-2 000 000 500 321 001,0000000001', -(2_000_000_500_321_001n * RESOLUTION + 1n)],
  ['2 000 500 321 001,0000123', 2_000_500_321_001n * RESOLUTION + 123_000n],
  ['-2 000 500 321 001,0000123', -(2_000_500_321_001n * RESOLUTION + 123_000n)],
  ['2 000 500 321 001', 2_000_500_321_001n * RESOLUTION],
  ['-2 000 500 321 001', -2_000_500_321_001n * RESOLUTION],
  ['200 000 000 000', 200_000_000_000n * RESOLUTION],
  ['-200 000 000 000', -200_000_000_000n * RESOLUTION],
  ['20 000 000 000', 20_000_000_000n * RESOLUTION],
  ['-20 000 000 000', -20_000_000_000n * RESOLUTION],
  ['2 000 000 000', 2_000_000_000n * RESOLUTION],
  ['-2 000 000 000', -2_000_000_000n * RESOLUTION],
  ['200 000 000', 200_000_000n * RESOLUTION],
  ['-200 000 000', -200_000_000n * RESOLUTION],
  ['20 000 000', 20_000_000n * RESOLUTION],
  ['-20 000 000', -20_000_000n * RESOLUTION],
  ['200 000', 200_000n * RESOLUTION],
  ['-200 000', -200_000n * RESOLUTION],
  ['200 000,56', 200_000n * RESOLUTION + 56_0000_0000n],
  ['-200 000,56', -(200_000n * RESOLUTION + 56_0000_0000n)],
  ['200,05', 200n * RESOLUTION + 5_0000_0000n],
  ['-200,05', -(200n * RESOLUTION + 5_0000_0000n)],
  ['1,10', 1n * RESOLUTION + 10_0000_0000n],
  ['1,08', 1n * RESOLUTION + 8_0000_0000n],
  ['1,01', 1n * RESOLUTION + 1_0000_0000n],
  ['-0,56', -56_0000_0000n],
  ['0,56', 56_0000_0000n],
  ['0,08', 8_0000_0000n],
  ['0,012', 12_000_0000n],
  ['0,008', 8_000_0000n],
  ['0,0000000008', 8n],
  ['0,00000000009', 1n],
  ['-0,00000000009', -1n],
  ['0,00000000005', 1n],
  ['-0,00000000005', -1n],
  ['0,00000000004', 0n],
  ['-0,00000000004', 0n],
  ['0,00000000001', 0n],
  ['-0,00000000001', 0n],
  ['0,00000000001', 0n],
  ['-0,00000000001', 0n],
  ['0,00000000000', 0n],
  ['-0,00000000000', 0n],
  ['0', 0n],
  ['-0', 0n],
  ['0,0', 0n],
  ['-0,0', 0n],
  ['0,00', 0n],
  ['-0,00', 0n],
];

const FAILURE_PARSE_TESTS: string[] = ['200 0o0'];

describe('Parse money', () => {
  for (const [input, expected] of SUCCESS_PARSE_MONEY_TESTS) {
    it(`should parse "${input}" to ${expected.toString(10)}`, () => {
      const actual = parseMoney(input);
      expect(actual).toBe(expected);
    });
  }

  for (const input of FAILURE_PARSE_TESTS) {
    it(`should throw on invalid integer ${input}`, () => {
      expect(() => parseMoney(input)).toThrow();
    });
  }
});

const SUCCESS_PARSE_DECIMAL_TESTS: [string, bigint][] = [
  ['123', 123_000_0000n], // 563 * 10^7
  ['56', 56_000_000_00n], // 56 * 10^8
  ['8', 8_000_000_000n], // 8 * 10^9
  ['012', 12_000_0000n], // 12 * 10^7
  ['008', 8_000_0000n], // 8 * 10^7
  ['0008', 8_000_000n], // 8 * 10^6
  ['00008', 8_000_00n], // 8 * 10^5
  ['000008', 8_000_0n], // 8 * 10^4
  ['0000008', 8_000n], // 8 * 10^3
  ['00000008', 800n], // 8 * 10^2
  ['000000008', 80n], // 8 * 10^1
  ['0000000008', 8n], // 8 * 10^0
  ['00000000009', 1n], // rounds up
  ['00000000005', 1n], // rounds up
  ['00000000004', 0n], // rounds down
  ['00000000001', 0n], // rounds down
  ['0000', 0n],
  ['0', 0n],
  ['', 0n],
];

describe('Parse decimal', () => {
  for (const [input, expected] of SUCCESS_PARSE_DECIMAL_TESTS) {
    it(`should parse "${input}" to ${expected.toString(10)}`, () => {
      const actual = parseDecimal(input);
      expect(actual).toBe(expected);
    });
  }
});

const PRETTY_FORMAT_TESTS: [bigint, string][] = [
  [2_000_000_500_321_001n * RESOLUTION + 1n, '2 000 000 500 321 001,0000000001'],
  [-(2_000_000_500_321_001n * RESOLUTION + 1n), '-2 000 000 500 321 001,0000000001'],
  [2_000_500_321_001n * RESOLUTION + 123_000n, '2 000 500 321 001,0000123'],
  [-(2_000_500_321_001n * RESOLUTION + 123_000n), '-2 000 500 321 001,0000123'],
  [2_000_500_321_001n * RESOLUTION, '2 000 500 321 001,00'],
  [-2_000_500_321_001n * RESOLUTION, '-2 000 500 321 001,00'],
  [200_000_000_000n * RESOLUTION, '200 000 000 000,00'],
  [-200_000_000_000n * RESOLUTION, '-200 000 000 000,00'],
  [20_000_000_000n * RESOLUTION, '20 000 000 000,00'],
  [-20_000_000_000n * RESOLUTION, '-20 000 000 000,00'],
  [2_000_000_000n * RESOLUTION, '2 000 000 000,00'],
  [-2_000_000_000n * RESOLUTION, '-2 000 000 000,00'],
  [200_000_000n * RESOLUTION, '200 000 000,00'],
  [-200_000_000n * RESOLUTION, '-200 000 000,00'],
  [20_000_000n * RESOLUTION, '20 000 000,00'],
  [-20_000_000n * RESOLUTION, '-20 000 000,00'],
  [200_000n * RESOLUTION, '200 000,00'],
  [-200_000n * RESOLUTION, '-200 000,00'],
  [200_000n * RESOLUTION + 56_0000_0000n, '200 000,56'],
  [-(200_000n * RESOLUTION + 56_0000_0000n), '-200 000,56'],
  [200n * RESOLUTION + 5_0000_0000n, '200,05'],
  [-(200n * RESOLUTION + 5_0000_0000n), '-200,05'],
  [1n * RESOLUTION + 10_0000_0000n, '1,10'],
  [1n * RESOLUTION + 8_0000_0000n, '1,08'],
  [1n * RESOLUTION + 1_0000_0000n, '1,01'],
  [-56_0000_0000n, '-0,56'],
  [56_0000_0000n, '0,56'],
  [8_0000_0000n, '0,08'],
  [12_000_0000n, '0,012'],
  [8_000_0000n, '0,008'],
  [8n, '0,0000000008'],
  [1n, '0,0000000001'],
  [-1n, '-0,0000000001'],
  [0n, '0,00'],
];

const FORMAT_MONEY_TESTS: [bigint, string][] = PRETTY_FORMAT_TESTS.map(([input, pretty]) => [
  input,
  pretty.replaceAll(' ', ''),
]);

describe('Format money', () => {
  for (const [input, expected] of FORMAT_MONEY_TESTS) {
    it(`should format ${input.toString(10)} as "${expected}"`, () => {
      const actual = formatMoney(input);
      expect(actual).toBe(expected);
    });
  }
});

describe('Pretty format money', () => {
  for (const [input, expected] of PRETTY_FORMAT_TESTS) {
    it(`should pretty format ${input.toString(10)} as "${expected}"`, () => {
      const actual = prettyFormatMoney(input);
      expect(actual).toBe(m(expected));
    });
  }
});

const NON_BREAKING_SPACE = '\u00A0';
const MINUS_SIGN = '\u2212';

const m = (value: string) => `${value.replaceAll('-', MINUS_SIGN).replaceAll(/\s/gi, NON_BREAKING_SPACE)} kr`;
