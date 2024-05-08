package main

import "testing"

type FormatMoneyTest struct {
	input    int
	expected string
}

var formatMoneyTests = []FormatMoneyTest{
	{0, ""},
	{1, "0,01"},
	{10, "0,10"},
	{15, "0,15"},
	{50, "0,50"},
	{99, "0,99"},
	{100, "1,00"},
	{101, "1,01"},
	{150, "1,50"},
	{999, "9,99"},
	{1000, "10,00"},
	{1001, "10,01"},
	{1111, "11,11"},
	{1234, "12,34"},
	{1500, "15,00"},
	{10000, "100,00"},
	{15000, "150,00"},
	{100000, "1000,00"},
	{1000000, "10000,00"},
	{10000000, "100000,00"},
	{100000000, "1000000,00"},
	{1000000000, "10000000,00"},
	{10000000000, "100000000,00"},
	{100000000000, "1000000000,00"},
}

func TestFormatMoney(t *testing.T) {
	for _, test := range formatMoneyTests {
		actual := formatMoney(test.input)
		if actual != test.expected {
			t.Errorf("Expected %s but got %s", test.expected, actual)
		}
	}
}
