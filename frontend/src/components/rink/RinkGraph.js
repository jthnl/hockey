import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "./RinkGraph.css";

const RinkGraph = ({data}) => {
  const aspectRatio =  200 / 85;

  const [plotWidth, setPlotWidth] = useState(800);
  const [plotHeight, setPlotHeight] = useState(450);

  useEffect(() => {
    const updateSize = () => {
      const container = document.getElementById("rink-graph-container");
      const newHeight = container.clientHeight;
      const newWidth = newHeight / aspectRatio;
      
      setPlotWidth(newWidth);
      setPlotHeight(newHeight);
    };

    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const layout = {
    autosize: true,
    showlegend: false,
    // legend: {"orientation": "h"},
    width: plotWidth,
    height: plotHeight,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0,
    },
    xaxis: {
      range: [0, 85],
      showgrid: false,
      showline: false,
      fixedrange: true,
      visible: false
    },
    yaxis: {
      range: [0, 200],
      showgrid: false,
      showline: false,
      fixedrange: true,
      scaleanchor: "x",
      scaleratio: 1,
      visible: false
    },
    images: [
      {
        source: "https://i.imgur.com/yhc9sKd.png",
        xref: "x",
        yref: "y",
        x: 0,
        y: 0,
        sizex: 85,
        sizey: 200,
        opacity: 1,
        layer: "top",
        xanchor: "left",
        yanchor: "bottom",
      },
    ],
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  const config = {
    displayModeBar: false,
  };

  // useEffect(() => {
  //   Plotly.Plots.resize("plotlyChart");
  //  }, [sideBarOpen]);

  return (
    <div id="rink-graph-container" className="RinkGraph">
      <Plot
        data={data}
        layout={layout}
        config={config}
        useResizeHandler
        className="RinkGraphPlot"
      />
    </div>
  );
};

export default RinkGraph;
