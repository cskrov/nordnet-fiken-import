package nordnet

func GroupByMonth(lines []*NordnetLine) map[string][]*NordnetLine {
	monthMap := make(map[string][]*NordnetLine)
	for _, line := range lines {
		month := line.BokførtDato.Format("2006-01")
		monthMap[month] = append(monthMap[month], line)
	}
	return monthMap
}
