const handleUserUpdate = (player, event, setGraphData) => {
  if (!player) return;

  console.log("Updating plot with player:", player);
  console.log("Updating plot with event:", event);

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
      console.log("Fetched data:", data);

      const plotData = data.events.map((eventGroup) => ({
        x: eventGroup.y,
        y: eventGroup.x,
        mode: "markers",
        type: "scatter",
        name: eventGroup.event,
      }));

      const customColorscale = [
        [0, "rgba(242, 242, 100, 0)"],
        [0.1, "rgba(242, 238, 84, 0.1)"],
        [0.2, "rgba(242, 231, 80, 0.2)"],
        [0.3, "rgba(242, 184, 7, 0.3)"],
        [0.4, "rgba(242, 135, 5, 0.4)"],
        [0.5, "rgba(197, 33, 4, 0.5)"],
        [1, "rgba(150, 30, 3, 0.8)"],
      ];

      // Add 2D histogram contour plot
      plotData.unshift({
        x: data.events.flatMap((eventGroup) => eventGroup.y),
        y: data.events.flatMap((eventGroup) => eventGroup.x),
        name: "density",
        ncontours: 20,
        colorscale: customColorscale,
        // reversescale: true,
        showscale: false,
        type: "histogram2dcontour",
        line: { width: 0 },
      });

      setGraphData(plotData);
    });
};

export default handleUserUpdate;
