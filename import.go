package main

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"golang.org/x/text/encoding/unicode"
	"golang.org/x/text/transform"
)

const FIKEN_HEADERS = "Til konto;Bokført dato;Forklarende tekst;Inngående;Ut;Inn;Saldo;Referanse"

const NORDNET_HEADER_ID = "Id"
const NORDNET_HEADER_BOKFORT_DATO = "Bokføringsdag"
const NORDNET_HEADER_KONTO = "Portefølje"
const NORDNET_HEADER_BELØP = "Beløp"
const NORDNET_HEADER_SALDO = "Saldo"
const NORDNET_HEADER_FORKLARENDE_TEKST = "Transaksjonstekst"

func main() {
	if len(os.Args) < 2 {
		panic("Missing argument: Nordnet file path")
	}

	nordnetFilePath := os.Args[1]

	if nordnetFilePath == "" {
		panic("Empty argument: Nordnet file path")
	}

	outputFileName := ""

	if len(os.Args) > 2 {
		outputFileName = os.Args[2]
	} else {
		_, file := filepath.Split(nordnetFilePath)
		outputFileName = file
	}

	data, err := readFileUTF16(nordnetFilePath)
	check(err)
	content := string(data)
	lines := strings.Split(content, "\n")

	nordnetHeaders := strings.Split(lines[0], "\t")

	idIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_ID)
	bokførtDatoIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_BOKFORT_DATO)
	changeIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_BELØP)
	kontoIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_KONTO)
	saldoIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_SALDO)
	forklarendeTekstIndex := findHeaderIndex(nordnetHeaders, NORDNET_HEADER_FORKLARENDE_TEKST)

	fikenLines := []string{}

	for i, line := range lines {
		if i == 0 || strings.TrimSpace(line) == "" {
			continue
		}

		fields := strings.Split(line, "\t")

		change := parseMoney(fields[changeIndex])
		after := parseMoney(fields[saldoIndex])
		before := after - change

		tilKonto := fields[kontoIndex]
		bokførtDato := fields[bokførtDatoIndex]
		inngående := formatMoney(before)
		inn := formatMoney(change)
		ut := formatMoney(0)
		saldo := formatMoney(after)
		forklarendeTekst := fields[forklarendeTekstIndex]
		referanse := fields[idIndex]

		fikenLine := []string{tilKonto, bokførtDato, forklarendeTekst, inngående, ut, inn, saldo, referanse}

		fikenLines = append(fikenLines, strings.Join(fikenLine, ";"))
	}

	if len(fikenLines) == 0 {
		panic("No transactions found")
	}

	ssv := FIKEN_HEADERS + "\n" + strings.Join(fikenLines, "\n")

	err = os.WriteFile("output/"+outputFileName, []byte(ssv), 0644)
	check(err)
}

func readFileUTF16(filename string) ([]byte, error) {
	raw, err := os.ReadFile(filename)

	if err != nil {
		return nil, err
	}

	utf16le := unicode.UTF16(unicode.LittleEndian, unicode.IgnoreBOM)
	utf16bom := unicode.BOMOverride(utf16le.NewDecoder())
	unicodeReader := transform.NewReader(bytes.NewReader(raw), utf16bom)
	decoded, err := io.ReadAll(unicodeReader)
	return decoded, err
}

func parseMoney(s string) int {
	parts := strings.Split(s, ",")
	first := parseInt(parts[0]) * 100

	if len(parts) == 1 {
		return first
	}

	second := parseInt(parts[1])

	return first + second
}

func parseInt(s string) int {
	s = strings.ReplaceAll(s, " ", "")
	i, err := strconv.Atoi(s)
	check(err)
	return i
}

func formatMoney(i int) string {
	if i == 0 {
		return ""
	}

	integer := i / 100
	decimal := i % 100
	return fmt.Sprintf("%d,%02d", integer, decimal)
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func findHeaderIndex(headers []string, header string) int {
	for i, h := range headers {
		if h == header {
			return i
		}
	}

	panic("Nordnet header not found: \"" + header + "\"")
}
