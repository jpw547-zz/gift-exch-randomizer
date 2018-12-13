# gift-exch-randomizer
_Gift Exchange Randomizer_

- A program used to take a list of names and generate a new mapping of who should get gifts for who from the list. 

_Usage_
- In a terminal, navigate to the directory containing the `gift-exch-randomizer` program. 
- Run the `main.go` binary along with the name of a file containing the list of names.
  - Ex: `go run main.go christmas_2016.json`

_Accepted Formats_
- _JSON_
  ```{
        "Derek" : "Jason",
        "Tommmy" : "Derek",
        "Allie" : "Tommy",
        "Jason" : "Allie",
     }```
