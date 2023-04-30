import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";

import Selection from "./components/selection/Selection";
import RinkGraph from "./components/rink/RinkGraph";
import UserCard from "./components/usercard/UserCard";

import handlePlotUpdate from "./actions/plotUpdate"

const App = () => {
  const [graphData, setGraphData] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handlePlayerSelect = (player) => {
    handlePlotUpdate(player, selectedEvent, setGraphData);
    setSelectedPlayer(player);
  };

  const handleEventSelect = (event) => {
    handlePlotUpdate(selectedPlayer, event, setGraphData);
    setSelectedEvent(event);
  };

  return (
    <div className="App">
      {/* Desktop and tablet view */}
      <Grid
        centered
        columns={3}
        padded
        divided
        stackable
      >
        <Grid.Row stretched>
          <Grid.Column width={4}>
            <Selection
              onPlayerSelect={handlePlayerSelect}
              onEventSelect={handleEventSelect}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <RinkGraph data={graphData} />
          </Grid.Column>
          <Grid.Column width={4}>
            {selectedPlayer != null && (
              <Grid.Row>
                <UserCard player={selectedPlayer} />
              </Grid.Row>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>

    </div>
  );
};

export default App;
