package money

import (
	"fmt"
	"strconv"
	"strings"

	"golang.org/x/exp/constraints"
)

type Money int

func ParseMoney(s string) Money {
	parts := strings.Split(s, ",")
	first := parseInt(parts[0]) * 100

	if len(parts) == 1 {
		return Money(first)
	}

	second := parseInt(parts[1])

	return Money(first + second)
}

func parseInt(s string) int {
	s = strings.ReplaceAll(s, " ", "")
	i, err := strconv.Atoi(s)
	if err != nil {
		fmt.Printf("Failed to parse integer: %s\n", s)
		panic(err)
	}
	return abs(i)
}

func (money Money) Format() string {
	integer := money / 100
	decimal := money % 100

	return fmt.Sprintf("%d,%02d", integer, decimal)
}

func abs[T constraints.Integer](x T) T {
	if x < 0 {
		return -x
	}
	return x
}
