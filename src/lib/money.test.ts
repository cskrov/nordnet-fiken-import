import { parseMoney, prettyFormatMoney } from '@app/lib/money';
import { describe, it, expect } from 'bun:test';

describe('Parse money', () => {
  it('should parse integer numbers', () => {
    const actual = parseMoney('200 000');
    expect(actual).toBe(200_000_00);
  });

  it('should parse decimal numbers', () => {
    const actual = parseMoney('200 000,56');
    expect(actual).toBe(200_000_56);
  });

  it('should parse negative numbers', () => {
    const actual = parseMoney('-200 000,56');
    expect(actual).toBe(-200_000_56);
  });

  it('should parse negative numbers without decimal', () => {
    const actual = parseMoney('-200 000');
    expect(actual).toBe(-200_000_00);
  });

  it('should parse negative numbers without integer', () => {
    const actual = parseMoney('-0,56');
    expect(actual).toBe(-56);
  });

  it('should throw on invalid integer', () => {
    expect(() => parseMoney('200 0o0')).toThrow();
  });
});

describe('Pretty format money', () => {
  it('should pretty format 200_000_56', () => {
    const actual = prettyFormatMoney(200_000_56);
    expect(actual).toBe("200 000,56 kr");
  });

  it('should pretty format 200_000', () => {
    const actual = prettyFormatMoney(200_000_00);
    expect(actual).toBe("200 000,00 kr");
  });

  it('should pretty format 200', () => {
    const actual = prettyFormatMoney(200_00);
    expect(actual).toBe("200,00 kr");
  });

  it('should pretty format 2000', () => {
    const actual = prettyFormatMoney(2000_00);
    expect(actual).toBe("2 000,00 kr");
  });

  it('should pretty format 0', () => {
    const actual = prettyFormatMoney(0);
    expect(actual).toBe("0,00 kr");
  });

  it('should pretty format -200_000_56', () => {
    const actual = prettyFormatMoney(-200_000_56);
    expect(actual).toBe("-200 000,56 kr");
  });

  it('should pretty format -200_000', () => {
    const actual = prettyFormatMoney(-200_000_00);
    expect(actual).toBe("-200 000,00 kr");
  });

  it('should pretty format -200', () => {
    const actual = prettyFormatMoney(-200_00);
    expect(actual).toBe("-200,00 kr");
  });
});
