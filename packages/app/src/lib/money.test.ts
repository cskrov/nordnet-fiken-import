import { describe, expect, it } from 'bun:test';
import { parseMoney, prettyFormatMoney } from '@app/lib/money';

const SUCCESS_PARSE_TESTS: [string, number][] = [
  ['200 000', 200_000_00],
  ['200 000,56', 200_000_56],
  ['200,05', 200_05],
  ['-200 000,56', -200_000_56],
  ['-200 000', -200_000_00],
  ['-0,56', -56],
  ['0,56', 56],
  ['0', 0],
  ['0,00', 0],
];

const FAILURE_PARSE_TESTS: string[] = ['200 0o0'];

describe('Parse money', () => {
  for (const [input, expected] of SUCCESS_PARSE_TESTS) {
    it(`should parse ${input}`, () => {
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

const SUCCESS_PRETTY_FORMAT_TESTS: [number, string][] = [
  [200_000_56, '200 000,56'],
  [200_000_00, '200 000,00'],
  [200_00, '200,00'],
  [200_05, '200,05'],
  [2000_00, '2 000,00'],
  [0, '0,00'],
  [-200_00, '-200,00'],
  [-200_000_00, '-200 000,00'],
  [-200_000_56, '-200 000,56'],
];

describe('Pretty format money', () => {
  for (const [input, expected] of SUCCESS_PRETTY_FORMAT_TESTS) {
    it(`should pretty format ${input}`, () => {
      const actual = prettyFormatMoney(input);
      expect(actual).toBe(m(expected));
    });
  }
});

const NON_BREAKING_SPACE = '\u00A0';
const MINUS_SIGN = '\u2212';

const m = (value: string) => `${value.replaceAll('-', MINUS_SIGN).replaceAll(/\s/gi, NON_BREAKING_SPACE)} kr`;
