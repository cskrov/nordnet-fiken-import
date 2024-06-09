package nordnet

import "testing"

func TestSortLines(t *testing.T) {
	lines := [][]string{
		{"1", "2", "3"},
		{"4", "5", "6"},
		{"7", "8", "9"},
	}

	sorted := sortLines(lines, 1)

	if sorted[0][2] != "3" || sorted[1][2] != "6" || sorted[2][2] != "9" {
		t.Errorf("Expected last column to be sorted")
	}
}
