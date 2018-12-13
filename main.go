package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"os"
	"strings"
	"time"
)

var lastTimeMap map[string]string
var names []string
var usedNames []string

func main() {
	// open the text file
	var lastTimeFile string

	if len(os.Args) > 1 {
		lastTimeFile = os.Args[1]
	}

	lastTimeBytes, err := ioutil.ReadFile(lastTimeFile)
	if err != nil {
		log.Printf("unable to open file %s", lastTimeFile)
		log.Print(err.Error())
		return
	}

	// read the text file into a map
	err = json.Unmarshal(lastTimeBytes, &lastTimeMap)
	if err != nil {
		log.Print("failed to unmarshal the last time list into a map")
		return
	}

	for k := range lastTimeMap {
		names = append(names, k)
	}

	random := rand.New(rand.NewSource(time.Now().UnixNano()))
	newMap := make(map[string]string)

	// iterate through the names and create a new mapping
	for i, name := range names {
		// get a random number from the possible count of names

		valid := false

		for !valid {
			randomIndex := random.Intn(len(names))

			if randomIndex != i && !nameIsTaken(names[randomIndex]) && !strings.EqualFold(lastTimeMap[name], names[randomIndex]) {
				valid = true
				newMap[name] = names[randomIndex]
				usedNames = append(usedNames, names[randomIndex])
			}
		}
	}

	var builder strings.Builder
	for k, v := range newMap {
		msg := fmt.Sprintf("%s has %s\n", k, v)
		builder.WriteString(msg)
	}

	result := strings.Trim(builder.String(), "\n")
	log.Printf("\n%s", result)

	fileTitle := strings.Split(lastTimeFile, ".")[0]
	ioutil.WriteFile(fmt.Sprintf("%s_result.txt", fileTitle), []byte(result), 0644)
}

func nameIsTaken(name string) bool {
	toReturn := false

	for _, n := range usedNames {
		if strings.EqualFold(name, n) {
			toReturn = true
		}
	}

	return toReturn
}
