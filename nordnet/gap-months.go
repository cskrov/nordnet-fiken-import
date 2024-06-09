package nordnet

import (
	"github.com/cskrov/nordnet-fiken-import/money"
	"github.com/cskrov/nordnet-fiken-import/util"
)

func fillGapMonths(nordnetLines []*NordnetLine) []*NordnetLine {
	var previousLine *NordnetLine

	filledInLines := []*NordnetLine{}

	for _, line := range nordnetLines {
		if previousLine == nil {
			previousLine = line
			filledInLines = append(filledInLines, line)
			continue
		}

		startYear := previousLine.BokførtDato.Year()
		yearDiff := line.BokførtDato.Year() - startYear
		monthDiff := int(line.BokførtDato.Month() - previousLine.BokførtDato.Month())
		missingMonths := yearDiff*12 + monthDiff

		// For each missing month, add a line with the previous line's saldo.
		for i := 1; i < missingMonths; i++ {
			date := previousLine.BokførtDato.AddDate(0, i, 0)
			endOfMonth := util.CalculateEndOfMonth(date)

			endOfMonthLine := &NordnetLine{
				TilKonto:         previousLine.TilKonto,
				BokførtDato:      endOfMonth,
				ForklarendeTekst: "Saldo",
				Inngående:        money.Money(0),
				Ut:               money.Money(0),
				Inn:              money.Money(0),
				Saldo:            previousLine.Saldo,
				Type:             SALDO,
			}

			filledInLines = append(filledInLines, endOfMonthLine)
		}

		previousLine = line
		filledInLines = append(filledInLines, line)
	}

	return filledInLines
}
