package nordnet

import (
	"time"

	"github.com/cskrov/nordnet-fiken-import/money"
	"github.com/cskrov/nordnet-fiken-import/util"
)

func addMissingEndMonths(nordnetLines []*NordnetLine) []*NordnetLine {
	lastLine := nordnetLines[len(nordnetLines)-1]

	now := time.Now()
	endOfCurrentMonth := util.CalculateEndOfMonth(now)

	endDate := endOfCurrentMonth

	if isLastDayOfMonth(now) {
		endDate = util.CalculateEndOfMonth(endDate.AddDate(0, -1, 0))
	}

	yearDiff := endDate.Year() - lastLine.BokførtDato.Year()
	monthDiff := int(endDate.Month() - lastLine.BokførtDato.Month())
	missingMonths := yearDiff*12 + monthDiff

	// For each missing month, add a line with the previous line's saldo.
	for i := 1; i < missingMonths; i++ {
		date := lastLine.BokførtDato.AddDate(0, i, 0)
		endOfMonth := util.CalculateEndOfMonth(date)

		endOfMonthLine := &NordnetLine{
			TilKonto:         lastLine.TilKonto,
			BokførtDato:      endOfMonth,
			ForklarendeTekst: "Saldo",
			Inngående:        money.Money(0),
			Ut:               money.Money(0),
			Inn:              money.Money(0),
			Saldo:            lastLine.Saldo,
			Type:             SALDO,
		}

		nordnetLines = append(nordnetLines, endOfMonthLine)
	}

	return nordnetLines
}

func isLastDayOfMonth(date time.Time) bool {
	return date.Day() == util.CalculateEndOfMonth(date).Day()
}
