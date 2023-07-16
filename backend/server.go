package main

import (
	"encoding/csv"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"fmt"
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
	port, exists := os.LookupEnv("PORT")
    if !exists {
        port = "4000"
    }

	router := mux.NewRouter()
	router.HandleFunc("/players", GetPlayers).Methods("GET")
	router.HandleFunc("/uniqueEvents", GetUniqueEvents).Methods("GET")
	router.HandleFunc("/filteredEvents", GetFilteredEvents).Methods("GET")
	router.HandleFunc("/playerEventCounts", GetPlayerEventCounts).Methods("GET")
	router.HandleFunc("/playerTeam", GetPlayerTeam).Methods("GET")

	// allow CORS 
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)
	fmt.Println("Running on port: ", port)
	log.Fatal(http.ListenAndServe(":" + port, handler))
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

func GetPlayerEventCounts(w http.ResponseWriter, r *http.Request) {
    player := r.URL.Query().Get("player")

    if player == "" {
        http.Error(w, "Missing player parameter", http.StatusBadRequest)
        return
    }

    events, err := readCSV()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    type DetailCounts struct {
        Detail1 map[string]int `json:"detail_1"`
        Detail2 map[string]int `json:"detail_2"`
        Detail3 map[string]int `json:"detail_3"`
        Detail4 map[string]int `json:"detail_4"`
    }

    eventCounts := make(map[string]*DetailCounts)
    for _, event := range events {
        if event.Player == player {
            if _, ok := eventCounts[event.Event]; !ok {
                eventCounts[event.Event] = &DetailCounts{
                    Detail1: make(map[string]int),
                    Detail2: make(map[string]int),
                    Detail3: make(map[string]int),
                    Detail4: make(map[string]int),
                }
            }

            if event.Detail1 != "" {
                eventCounts[event.Event].Detail1[event.Detail1]++
            }
            if event.Detail2 != "" {
                eventCounts[event.Event].Detail2[event.Detail2]++
            }
            if event.Detail3 != "" {
                eventCounts[event.Event].Detail3[event.Detail3]++
            }
            if event.Detail4 != "" {
                eventCounts[event.Event].Detail4[event.Detail4]++
            }
        }
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(eventCounts)
}

func GetPlayerTeam(w http.ResponseWriter, r *http.Request) {
	player := r.URL.Query().Get("player")
	if player == "" {
		http.Error(w, "player parameter is required", http.StatusBadRequest)
		return
	}

	events, err := readCSV()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var team string
	for _, event := range events {
		if event.Player == player {
			team = event.Team
			break
		}
	}

	if team == "" {
		http.Error(w, "Player not found", http.StatusNotFound)
		return
	}

	result := map[string]interface{}{
		"player": player,
		"team":   team,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
