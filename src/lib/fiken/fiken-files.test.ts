import { describe, expect, it } from 'bun:test';
import { createSignal } from 'solid-js';
import { fikenLinesToFikenFiles, sanitizeAlias } from '@/lib/fiken/fiken-files';
import type { FikenLine } from '@/lib/fiken/types';
import { NordnetType } from '@/lib/nordnet/types';

const makeFikenLine = (
  overrides: Partial<FikenLine> & Pick<FikenLine, 'nordnetKonto' | 'month' | 'year'>,
): FikenLine => {
  const [fraKonto, setFraKonto] = createSignal<string | null>(overrides.nordnetKonto);
  const [tilKonto, setTilKonto] = createSignal<string | null>(overrides.nordnetKonto);

  return {
    type: NordnetType.SALDO,
    bokførtDato: new Date(overrides.year, overrides.month - 1, 15),
    fraKonto,
    setFraKonto,
    tilKonto,
    setTilKonto,
    isin: null,
    forklarendeTekst: () => 'Test',
    inngående: 0n,
    ut: 0n,
    inn: 0n,
    saldo: 0n,
    referanse: 'ref-1',
    source: { fileName: 'test.csv', rowNumber: 0 },
    generated: false,
    unexpectedSaldo: false,
    unknownType: false,
    ...overrides,
  };
};

describe('fikenLinesToFikenFiles', () => {
  it('should include account name in file names', () => {
    const lines: FikenLine[] = [makeFikenLine({ nordnetKonto: '12345678', month: 3, year: 2024 })];

    const files = fikenLinesToFikenFiles(lines);

    expect(files.length).toBe(1);
    expect(files[0]?.fileName).toBe('nordnet-12345678-2024-03.fiken.csv');
  });

  it('should group lines by month and account', () => {
    const lines: FikenLine[] = [
      makeFikenLine({ nordnetKonto: 'A', month: 1, year: 2024, referanse: '1' }),
      makeFikenLine({ nordnetKonto: 'A', month: 1, year: 2024, referanse: '2' }),
      makeFikenLine({ nordnetKonto: 'A', month: 2, year: 2024, referanse: '3' }),
    ];

    const files = fikenLinesToFikenFiles(lines);

    expect(files.length).toBe(2);
    expect(files[0]?.rows.length).toBe(2);
    expect(files[1]?.rows.length).toBe(1);
  });

  it('should sanitize account name in file name', () => {
    const lines: FikenLine[] = [makeFikenLine({ nordnetKonto: 'Min Portefølje', month: 6, year: 2024 })];

    const files = fikenLinesToFikenFiles(lines);

    expect(files[0]?.fileName).toBe('nordnet-min-portefølje-2024-06.fiken.csv');
  });

  it('should produce separate files for different accounts in the same month', () => {
    const lines: FikenLine[] = [
      makeFikenLine({ nordnetKonto: 'A', month: 3, year: 2024, referanse: '1' }),
      makeFikenLine({ nordnetKonto: 'B', month: 3, year: 2024, referanse: '2' }),
    ];

    const files = fikenLinesToFikenFiles(lines);

    expect(files.length).toBe(2);
    expect(files[0]?.fileName).toContain('-a-');
    expect(files[1]?.fileName).toContain('-b-');
  });

  it('should include alias in file name when provided', () => {
    const lines: FikenLine[] = [makeFikenLine({ nordnetKonto: 'Aksjesparekonto', month: 3, year: 2024 })];

    const files = fikenLinesToFikenFiles(lines, 'Sparekonto');

    expect(files[0]?.fileName).toBe('nordnet-sparekonto-aksjesparekonto-2024-03.fiken.csv');
  });

  it('should preserve dashes and replace spaces with underscores in alias', () => {
    const lines: FikenLine[] = [makeFikenLine({ nordnetKonto: 'Aksjesparekonto', month: 3, year: 2024 })];

    const files = fikenLinesToFikenFiles(lines, 'Aksje- og fondskonto');

    expect(files[0]?.fileName).toBe('nordnet-aksje-_og_fondskonto-aksjesparekonto-2024-03.fiken.csv');
  });

  it('should omit alias from file name when null', () => {
    const lines: FikenLine[] = [makeFikenLine({ nordnetKonto: 'Aksjesparekonto', month: 3, year: 2024 })];

    const files = fikenLinesToFikenFiles(lines, null);

    expect(files[0]?.fileName).toBe('nordnet-aksjesparekonto-2024-03.fiken.csv');
  });
});

describe('sanitizeAlias', () => {
  it('should lowercase the alias', () => {
    expect(sanitizeAlias('Sparekonto')).toBe('sparekonto');
  });

  it('should replace spaces with underscores', () => {
    expect(sanitizeAlias('Aksje- og fondskonto')).toBe('aksje-_og_fondskonto');
  });

  it('should collapse multiple consecutive spaces into one underscore', () => {
    expect(sanitizeAlias('Aksje  konto')).toBe('aksje_konto');
  });

  it('should preserve dashes', () => {
    expect(sanitizeAlias('Aksje-og-fondskonto')).toBe('aksje-og-fondskonto');
  });

  it('should keep numbers', () => {
    expect(sanitizeAlias('Konto 2')).toBe('konto_2');
  });

  it('should keep norwegian characters', () => {
    expect(sanitizeAlias('Konto ÆØÅ')).toBe('konto_æøå');
  });

  it('should strip special characters', () => {
    expect(sanitizeAlias('Konto (privat)')).toBe('konto_privat');
  });

  it('should trim leading and trailing whitespace', () => {
    expect(sanitizeAlias('  Sparekonto  ')).toBe('sparekonto');
  });
});
