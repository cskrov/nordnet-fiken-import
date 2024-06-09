package main

import (
	"fmt"
	"os"
	"path"

	"github.com/cskrov/nordnet-fiken-import/fiken"
	"github.com/cskrov/nordnet-fiken-import/nordnet"
	"github.com/cskrov/nordnet-fiken-import/options"
)

func main() {
	opts := options.ParseOptions()

	os.Mkdir(opts.OutputDir, 0750)

	allLines := nordnet.ParseNordnetCSV(opts.NordnetFil, opts)

	if opts.Split {
		grouped := nordnet.GroupByMonth(allLines)

		for month, monthLines := range grouped {
			fikenSSV := fiken.ToFikenSSV(monthLines, opts.FraKonto)

			writeFile(opts.OutputDir, "nordnet-"+month, fikenSSV)
		}

		fmt.Printf("Genererte %d filer\n", len(grouped))

		os.Exit(0)
	}

	firstLine := allLines[0]
	lastLine := allLines[len(allLines)-1]

	name := lastLine.BokførtDato.Format("2006.01")

	if firstLine.BokførtDato.Year() != lastLine.BokførtDato.Year() || firstLine.BokførtDato.Month() != lastLine.BokførtDato.Month() {
		name += "-" + firstLine.BokførtDato.Format("2006.01")
	}

	fikenSSV := fiken.ToFikenSSV(allLines, opts.FraKonto)
	writeFile(opts.OutputDir, "nordnet-"+name, fikenSSV)
	println("Genererte 1 fil")
	os.Exit(0)
}

func writeFile(folder, name, fikenSSV string) {
	fileName := name + ".csv"
	err := os.WriteFile(path.Join(folder, fileName), []byte(fikenSSV), 0640)
	if err != nil {
		panic(err)
	}

	fmt.Printf("Genererte %s\n", fileName)
}
