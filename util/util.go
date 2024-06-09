package util

import "time"

func CalculateEndOfMonth(date time.Time) time.Time {
	return date.AddDate(0, 1, -date.Day())
}
