import React, { useEffect, useState } from "react";
import { Dropdown, Card } from "semantic-ui-react";
import "./Selection.css";

import { fetchPlayers, fetchUniqueEvents } from "../../services/api";

const Selection = ({ onPlayerSelect, onEventSelect }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [playerOptions, setPlayerOptions] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const players = await fetchPlayers();
      const uniqueEvents = await fetchUniqueEvents();

      setPlayerOptions(players);
      setEventOptions(uniqueEvents);
    };

    fetchData();
  }, []);

  const handlePlayerChange = (event, { value }) => {
    setSelectedPlayer(value);
    onPlayerSelect(value);
  };

  const handleEventChange = (event, { value }) => {
    setSelectedEvent(value);
    onEventSelect(value);
  };

  return (
    <div className="SelectionContainer">
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <h1>Filter</h1>
          </Card.Header>

          <div className="DropdownContainer">
            <h3>Player</h3>
            <Dropdown
              placeholder="Select a player"
              fluid
              search
              selection
              options={playerOptions}
              onChange={handlePlayerChange}
              value={selectedPlayer}
            />
          </div>
          {selectedPlayer != null && (
            <div className="DropdownContainer">
              <h3>Event</h3>
              <Dropdown
                placeholder="Select an Event"
                fluid
                search
                selection
                clearable
                options={eventOptions}
                onChange={handleEventChange}
                value={selectedEvent}
              />
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default Selection;