package nordnet

import (
	"sort"
	"strings"
	"time"

	"github.com/cskrov/nordnet-fiken-import/money"
)

func parseNordnetCSV(nordnetFilePath string) []*NordnetLine {
	data, _ := readFileUTF16(nordnetFilePath)
	content := string(data)

	lines := [][]string{}

	var nordnetHeaders []string

	for i, line := range strings.Split(content, "\n") {
		if i == 0 {
			nordnetHeaders = strings.Split(line, "\t")
		} else {
			fields := strings.Split(line, "\t")
			if len(fields) == len(nordnetHeaders) {
				lines = append(lines, fields)
			}
		}
	}

	idIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_ID)
	bokførtDatoIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_BOKFORT_DATO)
	beløpIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_BELØP)
	kontoIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_KONTO)
	saldoIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_SALDO)
	forklarendeTekstIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_FORKLARENDE_TEKST)
	transaksjonstypeIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_TYPE)

	sortLines(lines, bokførtDatoIndex) // Sort lines by date. Oldest first.

	nordnetLines := make([]*NordnetLine, len(lines))

	for i, fields := range lines {
		beløp := money.ParseMoney(fields[beløpIndex])
		saldo := money.ParseMoney(fields[saldoIndex])

		var nordnetType NordnetType
		var inngående money.Money

		rawType := fields[transaksjonstypeIndex]

		if rawType == "INNSKUDD" {
			nordnetType = INNSKUDD
			inngående = saldo - beløp
		} else if rawType == "UTTAK" {
			nordnetType = UTTAK
			inngående = saldo + beløp
		}

		bokførtDato, _ := time.Parse(DATE_FORMAT, fields[bokførtDatoIndex])

		line := &NordnetLine{
			TilKonto:         fields[kontoIndex],
			BokførtDato:      bokførtDato,
			Inngående:        inngående,
			Saldo:            saldo,
			ForklarendeTekst: fields[forklarendeTekstIndex],
			Referanse:        fields[idIndex],
			Type:             nordnetType,
		}

		if beløp > 0 {
			line.Inn = beløp
		} else {
			line.Ut = -beløp
		}

		nordnetLines[i] = line
	}

	return nordnetLines
}

func findHeaderIndex(headers []string, header string) int {
	for i, h := range headers {
		if h == header {
			return i
		}
	}

	panic("Nordnet header not found: \"" + header + "\"")
}

func sortLines(lines [][]string, fieldIndex int) [][]string {
	sort.SliceStable(lines, func(a, b int) bool {
		aValue := lines[a][fieldIndex]
		bValue := lines[b][fieldIndex]

		return aValue < bValue
	})

	return lines
}
