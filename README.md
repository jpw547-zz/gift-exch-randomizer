## Gift Exchange Randomizer

- A program used to take a list of names and generate a new mapping of who should get gifts for who from the list. 

### Usage
- In a terminal, navigate to the directory containing the `gift-exch-randomizer` program. 
- Run the `main.go` binary along with the name of a file containing the list of names.
  - Ex: ```go run main.go christmas_2016.json```
- Results will be both logged out in the terminal and also written out to a text file named ```[fileTitle]_result.txt``` where `[fileTitle]` will be replaced with the title preceeding the '.' in the given file name.
  - Ex: ```christmas_2016_result.txt```

### Accepted Formats
- _JSON_
  ```
  {
      "Derek" : "Jason",
      "Tommmy" : "Derek",
      "Allie" : "Tommy",
      "Jason" : "Allie",
  }
     ```
