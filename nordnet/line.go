package nordnet

import (
	"time"

	"github.com/cskrov/nordnet-fiken-import/money"
)

type NordnetType string
type NordnetDate time.Time

const (
	INNSKUDD NordnetType = "INNSKUDD"
	UTTAK    NordnetType = "UTTAK"
	SALDO    NordnetType = "SALDO"
)

type NordnetLine struct {
	TilKonto         string
	BokførtDato      time.Time
	Inngående        money.Money
	Inn              money.Money
	Ut               money.Money
	Saldo            money.Money
	ForklarendeTekst string
	Referanse        string
	Type             NordnetType
}
