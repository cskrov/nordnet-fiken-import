package nordnet

import (
	"time"

	"github.com/cskrov/nordnet-fiken-import/money"
	"github.com/cskrov/nordnet-fiken-import/util"
)

func addMissingStartMonths(firstLine *NordnetLine, fromDate time.Time) []*NordnetLine {
	endDate := firstLine.BokførtDato

	diffYears := endDate.Year() - fromDate.Year()
	diffMonths := int(endDate.Month() - fromDate.Month())
	missingMonths := diffYears*12 + diffMonths

	missingLines := []*NordnetLine{}

	saldo := firstLine.Saldo - firstLine.Inn + firstLine.Ut

	for i := 0; i < missingMonths; i++ {
		date := fromDate.AddDate(0, i, 0)
		endOfMonth := util.CalculateEndOfMonth(date)

		endOfMonthLine := &NordnetLine{
			TilKonto:         firstLine.TilKonto,
			BokførtDato:      endOfMonth,
			ForklarendeTekst: "Saldo",
			Inngående:        money.Money(0),
			Ut:               money.Money(0),
			Inn:              money.Money(0),
			Saldo:            saldo,
			Type:             SALDO,
		}

		missingLines = append(missingLines, endOfMonthLine)
	}

	return missingLines
}
