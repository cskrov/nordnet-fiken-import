type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const MONTHS = new Map<Month, string>([
  [1, 'Januar'],
  [2, 'Februar'],
  [3, 'Mars'],
  [4, 'April'],
  [5, 'Mai'],
  [6, 'Juni'],
  [7, 'Juli'],
  [8, 'August'],
  [9, 'September'],
  [10, 'Oktober'],
  [11, 'November'],
  [12, 'Desember'],
]);

const monthKeys = Array.from(MONTHS.keys());

export const isMonth = (value: number): value is Month => monthKeys.some((key) => key === value);
