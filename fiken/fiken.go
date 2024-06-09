package fiken

import (
	"bufio"
	"os"
	"time"

	"github.com/cskrov/nordnet-fiken-import/money"
	"github.com/cskrov/nordnet-fiken-import/nordnet"
	"github.com/cskrov/nordnet-fiken-import/util"
)

func ToFikenSSV(nordnetLines []*nordnet.NordnetLine, fraKonto string) string {
	if len(nordnetLines) == 0 {
		println("Ingen transaksjoner funnet i eksport fra Nordnet.")
		nordnetKonto := getUserInput("Nordnet kontonummer:")
		nordnetSaldo := getUserInput("Nordnet saldo:")
		nordnetDate := getUserInput("År og måned (f.eks. \"2024-02\"):")

		saldo := money.ParseMoney(nordnetSaldo)
		month, _ := time.Parse("2006-01", nordnetDate)

		ssv := FIKEN_HEADERS.String() + "\n"

		ssv += FikenLine{
			TilKonto:         nordnetKonto,
			BokførtDato:      util.CalculateEndOfMonth(month).Format(DATE_FORMAT),
			ForklarendeTekst: "Saldo",
			Inngående:        money.Money(0).Format(),
			Ut:               money.Money(0).Format(),
			Inn:              money.Money(0).Format(),
			Saldo:            saldo.Format(),
			Referanse:        "",
		}.String() + "\n"

		return ssv
	}

	fikenLines := []*FikenLine{}

	for i, nordnetLine := range nordnetLines {
		fikenLine := &FikenLine{
			TilKonto:         nordnetLine.TilKonto,
			BokførtDato:      nordnetLine.BokførtDato.Format(DATE_FORMAT),
			ForklarendeTekst: nordnetLine.ForklarendeTekst,
			Inngående:        nordnetLine.Inngående.Format(),
			Ut:               nordnetLine.Ut.Format(),
			Inn:              nordnetLine.Inn.Format(),
			Saldo:            nordnetLine.Saldo.Format(),
			Referanse:        nordnetLine.Referanse,
		}

		if nordnetLine.Type == nordnet.INNSKUDD {
			fikenLine.FraKonto = fraKonto
		}

		shouldAddEndOfMonthLine := false

		if i == 0 {
			shouldAddEndOfMonthLine = true
		} else {
			previousLine := nordnetLines[i-1]
			previousMonth := previousLine.BokførtDato.Month()
			currentMonth := nordnetLine.BokførtDato.Month()
			if previousMonth != currentMonth {
				shouldAddEndOfMonthLine = true
			}
		}

		if shouldAddEndOfMonthLine {
			endOfMonth := util.CalculateEndOfMonth(nordnetLine.BokførtDato)

			if endOfMonth.Day() != nordnetLine.BokførtDato.Day() {
				endOfMonthLine := &FikenLine{
					FraKonto:         "",
					TilKonto:         nordnetLine.TilKonto,
					BokførtDato:      endOfMonth.Format(DATE_FORMAT),
					ForklarendeTekst: "Saldo",
					Inngående:        money.Money(0).Format(),
					Ut:               money.Money(0).Format(),
					Inn:              money.Money(0).Format(),
					Saldo:            nordnetLine.Saldo.Format(),
					Referanse:        "",
				}
				fikenLines = append(fikenLines, endOfMonthLine)
			}
		}

		fikenLines = append(fikenLines, fikenLine)
	}

	ssv := FIKEN_HEADERS.String() + "\n"

	for _, fikenLine := range fikenLines {
		ssv += fikenLine.String() + "\n"
	}

	return ssv
}

func getUserInput(prompt string) string {
	println(prompt)
	input := bufio.NewScanner(os.Stdin)
	input.Scan()
	value := input.Text()

	if value == "" {
		return getUserInput(prompt)
	}

	return value
}
