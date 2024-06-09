package fiken

import "fmt"

type FikenLine struct {
	FraKonto         string
	TilKonto         string
	BokførtDato      string
	ForklarendeTekst string
	Inngående        string
	Ut               string
	Inn              string
	Saldo            string
	Referanse        string
}

func (fikenLine FikenLine) String() string {
	return fmt.Sprintf("%s;%s;%s;%s;%s;%s;%s;%s;%s", fikenLine.FraKonto, fikenLine.TilKonto, fikenLine.BokførtDato, fikenLine.ForklarendeTekst, fikenLine.Inngående, fikenLine.Ut, fikenLine.Inn, fikenLine.Saldo, fikenLine.Referanse)
}
