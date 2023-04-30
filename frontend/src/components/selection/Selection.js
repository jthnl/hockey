import React, { useEffect, useState } from "react";
import {
  Dropdown,
  Checkbox,
  Card,
  Container,
  Grid,
  Icon,
  Menu,
  Sidebar,
} from "semantic-ui-react";

import "./Selection.css";
import axios from "axios";

const Selection = ({ onPlayerSelect, onEventSelect }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [playerOptions, setPlayerOptions] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);


  const [selectedShotTypes, setSelectedShotTypes] = useState({
    deflection: false,
    fan: false,
    slapshot: false,
    snapshot: false,
    wrap_around: false,
    wristshot: false,
  });

const handleShotTypeChange = (event, { value }) => {
    setSelectedShotTypes(value);
  // Do something with the selected shot type, e.g., pass it to a parent component
};

const handleShotTypeCheckboxChange = (type) => {
    setSelectedShotTypes((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
    // Do something with the updated shot types, e.g., pass it to a parent component
  };


  useEffect(() => {
    // Fetch players
    fetch("http://localhost:8080/players")
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((player) => ({
          key: player,
          text: player,
          value: player,
        }));
        setPlayerOptions(options);
      });

    // Fetch unique events
    fetch("http://localhost:8080/uniqueEvents")
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((event) => ({
          key: event,
          text: event,
          value: event,
        }));
        setEventOptions(options);
      });
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
    <Card>
      <Card.Content>
      <Card.Header>
       <h1>Filter</h1>
    </Card.Header>

        
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

{selectedEvent === "Shot" && (
  <>
    <h3>Shot Type</h3>
    <div>
      <Checkbox
        label="Deflection"
        onChange={() => handleShotTypeCheckboxChange("deflection")}
        checked={selectedShotTypes.deflection}
      />
    </div>
    <div>
      <Checkbox
        label="Fan"
        onChange={() => handleShotTypeCheckboxChange("fan")}
        checked={selectedShotTypes.fan}
      />
    </div>
    <div>
      <Checkbox
        label="Slapshot"
        onChange={() => handleShotTypeCheckboxChange("slapshot")}
        checked={selectedShotTypes.slapshot}
      />
    </div>
    <div>
      <Checkbox
        label="Snapshot"
        onChange={() => handleShotTypeCheckboxChange("snapshot")}
        checked={selectedShotTypes.snapshot}
      />
    </div>
    <div>
      <Checkbox
        label="Wrap Around"
        onChange={() => handleShotTypeCheckboxChange("wrap_around")}
        checked={selectedShotTypes.wrap_around}
      />
    </div>
    <div>
      <Checkbox
        label="Wristshot"
        onChange={() => handleShotTypeCheckboxChange("wristshot")}
        checked={selectedShotTypes.wristshot}
      />
    </div>
  </>
)}
      </Card.Content>
    </Card>
    </div>
  );
};

export default Selection;
