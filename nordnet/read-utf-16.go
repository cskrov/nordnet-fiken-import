package nordnet

import (
	"bytes"
	"io"
	"os"

	"golang.org/x/text/encoding/unicode"
	"golang.org/x/text/transform"
)

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
