package main

import (
	"fmt"
	"os"
	"bufio"
	"regexp"
	"strings"
)

func findAllOverlapping(re *regexp.Regexp, s string) []string {
	var matches []string
	for i := 0; i < len(s); {
		loc := re.FindStringIndex(s[i:])
		if loc == nil {
			break
		}
		match := s[i+loc[0] : i+loc[1]]
		matches = append(matches, match)
		i += loc[0] + 1
	}
	return matches
}


func main() {
numberMap := map[string]int{
	"zero": 0,
	"one": 1,
	"two": 2,
	"three": 3,
	"four": 4,
	"five": 5,
	"six": 6,
	"seven": 7,
	"eight": 8,
	"nine": 9,
}
	file, err := os.Open(os.Args[1])
	if (err != nil) {
		panic(err)
	}
	scanner := bufio.NewScanner(file)
	re := regexp.MustCompile(`\d`)
	filesum := 0

	// 1st part

	for scanner.Scan() {
		line := scanner.Text()
		fmt.Println(line)

    matches := re.FindAllString(line, -1)
		if len(matches) > 0 {
			first := matches[0]
			last := matches[len(matches)-1]
			linesum := int(first[0]-'0')*10 + int(last[0]-'0')
			fmt.Println(first, "+", last, "=", linesum)
			filesum += linesum

		}
	}
	fmt.Println("1st part, total sum:", filesum)

	// 2nd part
	// supposedly no shorter way to write this in Go
  keys := []string{}
  for key := range numberMap {
    keys = append(keys, key)
  }

	filesum=0
  file.Seek(0, 0)
  scanner = bufio.NewScanner(file)  // Create new scanner

	numbersRe := strings.Join(keys, "|")
	re = regexp.MustCompile(`\d` + "|" + numbersRe)
	fmt.Println("Regex:", re.String())
	for scanner.Scan() {
		fmt.Println("-----")
		line := scanner.Text()
		fmt.Println(line)

    matches := findAllOverlapping(re, line)
		if len(matches) > 0 {
			first := matches[0]
			last := matches[len(matches)-1]

			first_num, ok := numberMap[first]
			if !ok {
				first_num = int(first[0] - '0')
			}
			last_num, ok := numberMap[last]
			if !ok {
				last_num = int(last[0] - '0')
			}


			linesum := first_num*10 + last_num
			fmt.Println(first_num, "+", last_num, "=", linesum)
			filesum += linesum

		}
	}
	fmt.Println("2nd part, total sum:", filesum)

}
