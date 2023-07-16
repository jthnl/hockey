import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";

import Selection from "./components/selection/Selection";
import RinkGraph from "./components/rink/RinkGraph";
import UserCard from "./components/usercard/UserCard";

import rinkUpdate from "./utilities/rinkUpdate";

const App = () => {
  const [graphData, setGraphData] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // rink update handlers
  const handlePlayerSelect = (player) => {
    rinkUpdate(player, selectedEvent, setGraphData);
    setSelectedPlayer(player);
  };

  const handleEventSelect = (event) => {
    rinkUpdate(selectedPlayer, event, setGraphData);
    setSelectedEvent(event);
  };

  return (
    <div className="App">
      <Grid centered columns={3} padded divided stackable>
        <Grid.Row stretched>
          {/* Filter Selection */}
          <Grid.Column width={4}>
            <Selection
              onPlayerSelect={handlePlayerSelect}
              onEventSelect={handleEventSelect}
            />
          </Grid.Column>

          {/* Rink Graph */}
          <Grid.Column width={8}>
            <RinkGraph data={graphData} />
          </Grid.Column>

          {/* Player Card */}
          <Grid.Column width={4}>
            <Grid.Row>
              <UserCard player={selectedPlayer} />
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default App;
