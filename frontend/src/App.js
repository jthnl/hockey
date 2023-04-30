import React, { useState } from "react";
import { Container, Grid, Icon, Menu, Sidebar } from "semantic-ui-react";

import "./App.css";
import RinkGraph from "./components/rink/RinkGraph";
import Selection from "./components/selection/Selection";

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [graphData, setGraphData] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handlePlotUpdate = (player, event) => {
    if (!player) return;

    console.log('Updating plot with player:', player);
    console.log('Updating plot with event:', event);

    const url = event
      ? `http://localhost:8080/filteredEvents?player=${encodeURIComponent(
          player
        )}&event=${encodeURIComponent(event)}`
      : `http://localhost:8080/filteredEvents?player=${encodeURIComponent(
          player
        )}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data);

        const plotData = data.events.map((eventGroup) => ({
          x: eventGroup.y,
          y: eventGroup.x,
          mode: "markers",
          type: "scatter",
          name: eventGroup.event,
        }));

        
      // Custom colorscale with transparency for low-density areas
      // const customColorscale = [
      //   [0, 'rgba(68, 1, 84, 0)'],
      //   [0.1, 'rgba(68, 1, 84, 0.1)'],
      //   [0.2, 'rgba(59, 82, 139, 0.2)'],
      //   [0.3, 'rgba(33, 144, 141, 0.3)'],
      //   [0.4, 'rgba(93, 201, 98, 0.4)'],
      //   [0.5, 'rgba(253, 231, 37, 0.5)'],
      //   [1, 'rgba(253, 231, 37, 1)'],
      // ];

      const customColorscale = [ 
        [0, 'rgba(242, 242, 100, 0)'],
        [0.1, 'rgba(242, 238, 84, 0.1)'],
        [0.2, 'rgba(242, 231, 80, 0.2)'],
        [0.3, 'rgba(242, 184, 7, 0.3)'],
        [0.4, 'rgba(242, 135, 5, 0.4)'],
        [0.5, 'rgba(197, 33, 4, 0.5)'],
        [1, 'rgba(150, 30, 3, 0.8)'],
      ];

        // Add 2D histogram contour plot
        plotData.push({
          x: data.events.flatMap((eventGroup) => eventGroup.y),
          y: data.events.flatMap((eventGroup) => eventGroup.x),
          name: "density",
          ncontours: 20,
          colorscale: customColorscale,
          // reversescale: true,
          showscale: false,
          type: "histogram2dcontour",
          line:{width:0},

        });

        setGraphData(plotData);
      });
  };

  const handlePlayerSelect = (player) => {
    handlePlotUpdate(player, selectedEvent);
    setSelectedPlayer(player);
  };

  const handleEventSelect = (event) => {
    handlePlotUpdate(selectedPlayer, event);
    setSelectedEvent(event);
  };


  const sideBarContent = (
    <Selection
      onPlayerSelect={handlePlayerSelect}
      onEventSelect={handleEventSelect}
    />
  )

  return (
    <div className="App">
      <Grid centered columns={2}>
        <Grid.Column width={4}>
          {sideBarContent}
        </Grid.Column>
        <Grid.Column width={7}>
            <RinkGraph data={graphData} />
        </Grid.Column>
        <Grid.Column width={5}>
            <h1>Hello World</h1>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default App;
