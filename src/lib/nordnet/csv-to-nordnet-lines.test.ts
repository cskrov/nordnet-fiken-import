import { describe, expect, it } from 'bun:test';
import { fixNordnetLines, groupNordnetLinesByAccount, toNordnetLines } from '@/lib/nordnet/csv-to-nordnet-lines';
import type { NordnetLine } from '@/lib/nordnet/types';

const makeNordnetLine = (overrides: Partial<NordnetLine> & Pick<NordnetLine, 'id' | 'portefølje'>): NordnetLine => ({
  bokførtDato: new Date('2024-03-15'),
  transaksjonstype: 'INNSKUDD',
  beløp: 10000n,
  saldo: 50000n,
  transaksjonstekst: 'Test',
  verdipapir: null,
  ISIN: null,
  month: 3,
  year: 2024,
  source: { fileName: 'test.csv', rowNumber: 0 },
  generated: false,
  unexpectedSaldo: false,
  unknownType: false,
  ...overrides,
});

describe('groupNordnetLinesByAccount', () => {
  it('should group lines by portefølje', () => {
    const lines: NordnetLine[] = [
      makeNordnetLine({ id: '1', portefølje: 'Konto A' }),
      makeNordnetLine({ id: '2', portefølje: 'Konto B' }),
      makeNordnetLine({ id: '3', portefølje: 'Konto A' }),
      makeNordnetLine({ id: '4', portefølje: 'Konto B' }),
      makeNordnetLine({ id: '5', portefølje: 'Konto A' }),
    ];

    const groups = groupNordnetLinesByAccount(lines);

    expect(groups.size).toBe(2);
    expect(groups.get('Konto A')?.length).toBe(3);
    expect(groups.get('Konto B')?.length).toBe(2);
  });

  it('should return a single group when all lines have the same account', () => {
    const lines: NordnetLine[] = [
      makeNordnetLine({ id: '1', portefølje: 'Konto A' }),
      makeNordnetLine({ id: '2', portefølje: 'Konto A' }),
    ];

    const groups = groupNordnetLinesByAccount(lines);

    expect(groups.size).toBe(1);
    expect(groups.get('Konto A')?.length).toBe(2);
  });

  it('should return an empty map for empty input', () => {
    const groups = groupNordnetLinesByAccount([]);

    expect(groups.size).toBe(0);
  });

  it('should preserve line order within each group', () => {
    const lines: NordnetLine[] = [
      makeNordnetLine({ id: '1', portefølje: 'A' }),
      makeNordnetLine({ id: '2', portefølje: 'B' }),
      makeNordnetLine({ id: '3', portefølje: 'A' }),
    ];

    const groups = groupNordnetLinesByAccount(lines);
    const groupA = groups.get('A');

    expect(groupA?.[0]?.id).toBe('1');
    expect(groupA?.[1]?.id).toBe('3');
  });

  it('should preserve account insertion order in map keys', () => {
    const lines: NordnetLine[] = [
      makeNordnetLine({ id: '1', portefølje: 'Zebra' }),
      makeNordnetLine({ id: '2', portefølje: 'Alpha' }),
      makeNordnetLine({ id: '3', portefølje: 'Middle' }),
    ];

    const groups = groupNordnetLinesByAccount(lines);
    const keys = [...groups.keys()];

    expect(keys).toEqual(['Zebra', 'Alpha', 'Middle']);
  });
});

describe('toNordnetLines', () => {
  const makeHeaders = () =>
    'Id\tBokføringsdag\tHandelsdag\tOppgjørsdag\tPortefølje\tTransaksjonstype\tVerdipapir\tISIN\tAntall\tKurs\tRente\tTotale Avgifter\tValuta\tBeløp\tValuta\tKjøpsverdi\tValuta\tResultat\tValuta\tTotalt antall\tSaldo\tVekslingskurs\tTransaksjonstekst';

  const makeRow = (id: string, date: string, account: string, type: string, amount: string, saldo: string) =>
    `${id}\t${date}\t${date}\t${date}\t${account}\t${type}\t\t\t\t\t\t\t\t${amount}\t\t\t\t\t\t\t${saldo}\t\t`;

  it('should parse lines from multiple accounts', () => {
    const headers = makeHeaders();
    const rows = [
      makeRow('101', '2024-03-15', 'Konto A', 'INNSKUDD', '1 000', '5 000'),
      makeRow('102', '2024-03-16', 'Konto B', 'INNSKUDD', '2 000', '8 000'),
    ];

    const csvFiles = [
      {
        fileName: 'test.csv',
        data: {
          headers: headers.split('\t'),
          rows: rows.map((r) => r.split('\t')),
        },
      },
    ];

    const lines = toNordnetLines(csvFiles);

    expect(lines.length).toBe(2);

    const accountNames = new Set(lines.map((l) => l.portefølje));
    expect(accountNames.size).toBe(2);
    expect(accountNames.has('Konto A')).toBe(true);
    expect(accountNames.has('Konto B')).toBe(true);
  });
});

describe('fixNordnetLines per account', () => {
  it('should not cross-contaminate when run on single-account data', () => {
    const allLines: NordnetLine[] = [
      makeNordnetLine({
        id: '1',
        portefølje: 'A',
        bokførtDato: new Date('2024-01-15'),
        month: 1,
        year: 2024,
        saldo: 1000n,
        beløp: 1000n,
      }),
      makeNordnetLine({
        id: '2',
        portefølje: 'A',
        bokførtDato: new Date('2024-03-15'),
        month: 3,
        year: 2024,
        saldo: 2000n,
        beløp: 1000n,
      }),
      makeNordnetLine({
        id: '10',
        portefølje: 'B',
        bokførtDato: new Date('2024-02-10'),
        month: 2,
        year: 2024,
        saldo: 5000n,
        beløp: 5000n,
      }),
    ];

    const groups = groupNordnetLinesByAccount(allLines);
    const fixedA = fixNordnetLines(groups.get('A') ?? []);
    const fixedB = fixNordnetLines(groups.get('B') ?? []);

    // Account A should only contain account A lines
    for (const line of fixedA) {
      expect(line.portefølje).toBe('A');
    }

    // Account B should only contain account B lines
    for (const line of fixedB) {
      expect(line.portefølje).toBe('B');
    }
  });

  it('should deduplicate lines with the same id within an account', () => {
    const lines: NordnetLine[] = [
      makeNordnetLine({ id: '1', portefølje: 'A', bokførtDato: new Date('2024-01-31'), month: 1, year: 2024 }),
      makeNordnetLine({ id: '1', portefølje: 'A', bokførtDato: new Date('2024-01-31'), month: 1, year: 2024 }),
    ];

    const fixed = fixNordnetLines(lines);
    const originalLines = fixed.filter((l) => l.id === '1');

    expect(originalLines.length).toBe(1);
  });

  it('should sort lines by numeric id, not lexicographic', () => {
    const lines: NordnetLine[] = [
      makeNordnetLine({ id: '100', portefølje: 'A', bokførtDato: new Date('2026-01-15'), month: 1, year: 2026 }),
      makeNordnetLine({ id: '9', portefølje: 'A', bokførtDato: new Date('2026-01-15'), month: 1, year: 2026 }),
      makeNordnetLine({ id: '10', portefølje: 'A', bokførtDato: new Date('2026-01-15'), month: 1, year: 2026 }),
    ];

    const fixed = fixNordnetLines(lines);
    const ids = fixed.filter((l) => !l.generated).map((l) => l.id);

    expect(ids).toEqual(['9', '10', '100']);
  });
});
