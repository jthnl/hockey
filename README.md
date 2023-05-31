# Hockey
Coding Project

![website image](https://github.com/jthnl/hockey/blob/main/images/Image1.png)

Data from https://github.com/bigdatacup/Big-Data-Cup-2021

## Development Guide
### Prerequisites
1. download and install Go: [Getting Started with Go](https://go.dev/doc/tutorial/getting-started)
2. download and install React: [Getting Started with React](https://create-react-app.dev/docs/getting-started)
### How to Run
#### Backend
1. cd ./backend
1. download dependencies: ```go mod install```
1. run server: ```$ PORT=<PORT> go run server.go``` (default port is 4000)
#### Frontend
1. cd ./frontend
2. download dependencies: ```npm i```
3. create ```.env.local``` file in ./frontend with ```REACT_APP_API_URL=http://localhost:<server port>``` (server port mentioned above)
4. run react: ```npm run start```

## Design
### Backend
- For this project, the backend was kept very simple. 
- backend serves REST endpoints that reads the CSV file and filters results based on specific parameters.
- Backend currently has 5 endpoints: 
    1. `/players` - returns list of all players from CSV
    2. `/uniqueEvents` - returns list of all events from CSV
    3. `/filteredEvents` - returns Events filtered by Player and Event Type
    3. `/playerEventCounts` - returns Counts all Events and their details
    3. `/playerTeam` - returns Player's Team
- Due to time constraints, development on the backend was less focused on.

### Frontend
- The frontend has three main componentse
   1. Filter - simple dropdown to select Player and Events
   2. Rink Graph - graph plot of all Events with heatmap
   3. User Card - user data and statistics
- For this project, the main goal was to design a clean, easy-to-use and visually appealing user interface.
- Due to time constraints, the main focus was on the Rink Graph functionality.


## Future Work
1. Backend Improvements
   - Use DBMS instead of reading directly from CSV for each endpoint
   - Add caching for speed
   - Improve code organization and documentation
   - Modularize (microservices) when needed
   - Add more endpoints/features

2. Frontend Improvements
   - Add more charts and graph types - add swappable graphs based on different event selection. 
   - Add more filters (period, powerplay, skaters on ice, play destination, event types)
