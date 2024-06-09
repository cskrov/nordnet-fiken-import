package nordnet

import (
	"slices"

	"github.com/cskrov/nordnet-fiken-import/options"
)

func ParseNordnetCSV(nordnetFilePath string, opts *options.Options) []*NordnetLine {
	nordnetLines := parseNordnetCSV(nordnetFilePath)

	firstLine := nordnetLines[0]

	if !opts.FromDate.IsZero() && opts.FromDate.Before(firstLine.BokførtDato) {
		nordnetLines = append(addMissingStartMonths(firstLine, opts.FromDate), nordnetLines...)
	}

	nordnetLines = fillGapMonths(nordnetLines)

	if opts.UntilNow {
		nordnetLines = addMissingEndMonths(nordnetLines)
	}

	slices.Reverse(nordnetLines) // Reverses in place. Mutates the original slice.

	return nordnetLines
}
