import { endOfMonth } from "date-fns";
import { NordnetType, type NordnetMap } from "@app/lib/nordnet/types";

export const fillMissingMonths = (nordnetMap: NordnetMap): NordnetMap => {
  const result: NordnetMap = new Map(nordnetMap);

  let previousYear = 0;
  let previousMonth = 0;

  for (const key of nordnetMap.keys()) {
    const [year, month] = key.split("-").map((n) => Number.parseInt(n, 10));

    if (previousYear === 0 || previousMonth === 0) {
      previousYear = year;
      previousMonth = month;
      continue;
    }

    const monthDiff = ((year - previousYear) * 12 + (month - previousMonth));

    if (monthDiff === 0) {
      continue;
    }

    // TODO: Bare generer manglende måneder dersom inngående og utgående saldoer matcher.
    // TODO: Hopp over måneder med forskjell i inngående saldo ift. forrige måned saldo.

    const previousLines = nordnetMap.get(`${previousYear}-${previousMonth}`);

    if (previousLines === undefined) {
      throw new Error("Previous month is undefined");
    }

    const previousMonthLine = previousLines.at(-1);

    if (previousMonthLine === undefined) {
      throw new Error("Previous month has no lines");
    }

    for (let i = 1; i < monthDiff; i++) {
      const [missingYear, missingMonth] = addMonths(previousYear, previousMonth, i);

      result.set(`${missingYear}-${missingMonth}`, [{
        bokførtDato: endOfMonth(new Date(missingYear, missingMonth - 1)),
        transaksjonstekst: "Saldo",
        inn: 0,
        ut: 0,
        inngående: previousMonthLine.saldo,
        saldo: previousMonthLine.saldo,
        tilKonto: previousMonthLine.tilKonto,
        type: NordnetType.SALDO,
        referanse: null,
        sourceFile: null,
        lineNumber: -1,
        month: missingMonth,
        year: missingYear,
      }]);
    }

    previousYear = year;
    previousMonth = month;
  }

  return result;
};

const addMonths = (baseYear: number, baseMonth: number, months: number): [number, number] => {
  let year = baseYear;
  let month = baseMonth;

  for (let i = 0; i < months; i++) {
    [year, month] = nextMonth(year, month);
  }

  return [year, month];
};

const nextMonth = (year: number, month: number): [number, number] => {
  if (month === 12) {
    return [year + 1, 1];
  }

  return [year, month + 1];
};
