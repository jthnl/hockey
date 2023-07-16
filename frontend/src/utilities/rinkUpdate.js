import { fetchFilteredEvents } from "../services/api";

const customColorscale = [
    [0, "rgba(242, 242, 100, 0)"],
    [0.1, "rgba(242, 238, 84, 0.1)"],
    [0.2, "rgba(242, 231, 80, 0.2)"],
    [0.3, "rgba(242, 184, 7, 0.2)"],
    [0.4, "rgba(242, 135, 5, 0.2)"],
    [0.5, "rgba(250, 33, 4, 0.2)"],
    [1, "rgba(252, 30, 3, 0.2)"],
];

const markerColorMap = {
  "Faceoff Win": 'rgb(190, 61, 255)',
  "Puck Recovery": 'rgb(72, 64, 229)',
  "Dump In/Out": 'rgb(67, 198, 250)',
  "Play": 'rgb(50, 227, 145)',
  "Shot": 'rgb(110, 251, 55)',
  "Penalty Taken": 'rgb(20, 90, 130)',
  "Zone Entry": 'rgb(20, 130, 64)',
  "Takeaway": 'rgb(148, 67, 209)',
  "Incomplete Play": 'rgb(80, 230, 250)',
  "Goal": 'rgb(207, 31, 81)',
};

// Update RinkGraph data
const rinkUpdate = async (player, event, setGraphData) => {
  if (!player) return;

  // Get Player's Events
  const data = await fetchFilteredEvents(player, event);
  const plotData = data.events.map((eventGroup) => ({
    x: eventGroup.y,
    y: eventGroup.x,
    mode: "markers",
    type: "scatter",
    name: eventGroup.event,
    marker: {
      color: markerColorMap[eventGroup.event],
      line: {
        color: 'rgb(100, 100, 100, 0.2)',
        width: 1
      }
    }
  }));

  // 2D histogram contour plot
  plotData.unshift({
    x: data.events.flatMap((eventGroup) => eventGroup.y),
    y: data.events.flatMap((eventGroup) => eventGroup.x),
    name: "density",
    ncontours: 20,
    colorscale: customColorscale,
    showscale: false,
    type: "histogram2dcontour",
    line: { width: 0 },
  });

  setGraphData(plotData);
};

export default rinkUpdate;
