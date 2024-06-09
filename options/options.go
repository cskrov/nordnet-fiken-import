package options

import (
	"os"
	"strings"
	"time"
)

type Options struct {
	FraKonto   string
	NordnetFil string
	Split      bool
	UntilNow   bool
	FromDate   time.Time
	OutputDir  string
}

func ParseOptions() *Options {
	argCount := len(os.Args)

	if argCount < 2 {
		println("For få argumenter")
		showHelp()
		os.Exit(1)
	}

	options := &Options{
		Split:     false,
		UntilNow:  false,
		OutputDir: "./output",
	}

	for i := 1; i < argCount; i++ {
		arg := os.Args[i]

		if arg == "--help" || arg == "-h" {
			showHelp()
		} else if arg == "--split" {
			options.Split = true
		} else if strings.HasSuffix(arg, ".csv") {
			options.NordnetFil = arg
		} else if arg == "--until-now" {
			options.UntilNow = true
		} else if arg == "--from" {
			i++
			fromDate, _ := time.Parse("2006-01", os.Args[i])
			options.FromDate = fromDate
		} else if arg == "--out" {
			i++
			options.OutputDir = os.Args[i]
		} else {
			options.FraKonto = arg
		}
	}

	if options.NordnetFil == "" {
		println("Nordnet fil mangler")
		os.Exit(1)
	}

	if options.FraKonto == "" {
		println("Advarsel: Ingen \"fra konto\" er oppgitt, fra konto vil ikke bli satt.")
	}

	return options
}

func showHelp() {
	println("Bruk: nordnet-fiken-import <nordnet-file-path> [source-account-number] [--split] [--until-now] [--from <YYYY-MM>]")
	println("Eksempel: nordnet-fiken-import nordnet.csv 4321.01.12345 --split --until-now --from 2024-02")
	println("  --split: Deler opp transaksjoner i separate filer per måned.")
	println("  --until-now: Genererer saldo per måned frem til nåværende måned. Praktisk dersom det ikke har vært transaksjoner på en stund, men du vil fortsatt avstemme månedene.")
	println("  --from: Dato for å starte importen fra. Datoen må være i formatet \"YYYY-MM\". Praktisk dersom kontoen er avstemt til en tidligere dato og du vil fortsette importen med samme saldo.")
	println("  --out: Angir en annen mappe enn ./output for å lagre filene.")

	os.Exit(0)
}
