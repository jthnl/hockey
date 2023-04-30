package main

import (
	"encoding/csv"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Event struct {
	GameDate         string `json:"game_date"`
	HomeTeam         string `json:"home_team"`
	AwayTeam         string `json:"away_team"`
	Period           string `json:"period"`
	Clock            string `json:"clock"`
	HomeTeamSkaters  string `json:"home_team_skaters"`
	AwayTeamSkaters  string `json:"away_team_skaters"`
	HomeTeamGoals    string `json:"home_team_goals"`
	AwayTeamGoals    string `json:"away_team_goals"`
	Team             string `json:"team"`
	Player           string `json:"player"`
	Event            string `json:"event"`
	XCoordinate      string `json:"x_coordinate"`
	YCoordinate      string `json:"y_coordinate"`
	Detail1          string `json:"detail_1"`
	Detail2          string `json:"detail_2"`
	Detail3          string `json:"detail_3"`
	Detail4          string `json:"detail_4"`
	Player2          string `json:"player_2"`
	XCoordinate2     string `json:"x_coordinate_2"`
	YCoordinate2     string `json:"y_coordinate_2"`
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/players", GetPlayers).Methods("GET")
	router.HandleFunc("/events", GetEvents).Methods("GET")
	router.HandleFunc("/events/player/{player}", GetEventsByPlayer).Methods("GET")
	router.HandleFunc("/filteredEvents", GetFilteredEvents).Methods("GET")
	router.HandleFunc("/uniqueEvents", GetUniqueEvents).Methods("GET")


	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	log.Fatal(http.ListenAndServe(":8080", handler))
}

func readCSV() ([]Event, error) {
	file, err := os.Open("olympic_womens_dataset.csv")
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	_, err = reader.Read() // Skip header line
	if err != nil {
		return nil, err
	}

	var events []Event
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		events = append(events, Event{
			GameDate:       record[0],
			HomeTeam:       record[1],
			AwayTeam:       record[2],
			Period:         record[3],
			Clock:          record[4],
			HomeTeamSkaters: record[5],
			AwayTeamSkaters: record[6],
			HomeTeamGoals:   record[7],
			AwayTeamGoals:   record[8],
			Team:            record[9],
			Player:          record[10],
			Event:           record[11],
			XCoordinate:     record[12],
			YCoordinate:     record[13],
			Detail1:         record[14],
			Detail2:         record[15],
			Detail3:         record[16],
			Detail4:         record[17],
			Player2:         record[18],
			XCoordinate2:    record[19],
			YCoordinate2:    record[20],
		})
	}

	return events, nil
}

func GetPlayers(w http.ResponseWriter, r *http.Request) {
	events, err := readCSV()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	playerSet := make(map[string]struct{})
	for _, event := range events {
		playerSet[event.Player] = struct{}{}
	}

	var players []string
	for player := range playerSet {
		players = append(players, player)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(players)
}

func GetEvents(w http.ResponseWriter, r *http.Request) {
	events, err := readCSV()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}

func GetEventsByPlayer(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	player := strings.ToLower(params["player"])

	events, err := readCSV()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	filteredEvents := make([]Event, 0)
	for _, event := range events {
		if strings.ToLower(event.Player) == player || strings.ToLower(event.Player2) == player {
			filteredEvents = append(filteredEvents, event)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(filteredEvents)
}

func GetUniqueEvents(w http.ResponseWriter, r *http.Request) {
	events, err := readCSV()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	eventSet := make(map[string]struct{})

	for _, event := range events {
		eventSet[event.Event] = struct{}{}
	}

	uniqueEvents := make([]string, 0, len(eventSet))
	for event := range eventSet {
		uniqueEvents = append(uniqueEvents, event)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(uniqueEvents)
}

func GetFilteredEvents(w http.ResponseWriter, r *http.Request) {
	player := r.URL.Query().Get("player")
	eventFilter := r.URL.Query().Get("event")
	flipAxis := r.URL.Query().Get("flipAxis")

	if player == "" {
		http.Error(w, "player parameter is required", http.StatusBadRequest)
		return
	}

	events, err := readCSV()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	type EventGroup struct {
		Event  string   `json:"event"`
		X      []string `json:"x"`
		Y      []string `json:"y"`
	}

	eventGroupsMap := make(map[string]*EventGroup)

	for _, event := range events {
		if event.Player == player && (eventFilter == "" || event.Event == eventFilter) {
			if eventGroup, ok := eventGroupsMap[event.Event]; ok {
				eventGroup.X = append(eventGroup.X, event.XCoordinate)
				eventGroup.Y = append(eventGroup.Y, event.YCoordinate)
			} else {
				eventGroupsMap[event.Event] = &EventGroup{
					Event: event.Event,
					X:     []string{event.XCoordinate},
					Y:     []string{event.YCoordinate},
				}
			}
		}
	}

	eventGroups := make([]EventGroup, 0, len(eventGroupsMap))
	for _, eventGroup := range eventGroupsMap {
		eventGroups = append(eventGroups, *eventGroup)
	}

	result := map[string]interface{}{
		"events": eventGroups,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}




func generateZValues(xCoords, yCoords []string, numRows, numCols int) [][]int {
	zValues := make([][]int, numRows)

	for i := range zValues {
		zValues[i] = make([]int, numCols)
	}

	for _, x := range xCoords {
		xVal, _ := strconv.Atoi(x)
		for _, y := range yCoords {
			yVal, _ := strconv.Atoi(y)
			xIndex := xVal % numRows
			yIndex := yVal % numCols
			zValues[xIndex][yIndex]++
		}
	}

	return zValues
}
