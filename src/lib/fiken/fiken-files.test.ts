import { describe, expect, it } from 'bun:test';
import { fikenLinesToFikenFiles } from '@app/lib/fiken/fiken-files';
import type { FikenLine } from '@app/lib/fiken/types';
import { NordnetType } from '@app/lib/nordnet/types';
import { createSignal } from 'solid-js';

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
    ...overrides,
  };
};

describe('fikenLinesToFikenFiles', () => {
  it('should include account name in file names', () => {
    const lines: FikenLine[] = [makeFikenLine({ nordnetKonto: '12345678', month: 3, year: 2024 })];

    const files = fikenLinesToFikenFiles(lines);

    expect(files.length).toBe(1);
    expect(files[0]?.fileName).toBe('nordnet-fiken-12345678-2024.03.csv');
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

    expect(files[0]?.fileName).toBe('nordnet-fiken-min-portefølje-2024.06.csv');
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
});
