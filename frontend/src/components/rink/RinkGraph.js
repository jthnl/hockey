import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "./RinkGraph.css";
import rinkImage from "./rink.png";

const rinkWidth = 200;
const rinkDepth = 85;
const aspectRatio =  rinkWidth / rinkDepth;

const RinkGraph = ({data}) => {
  const [plotWidth, setPlotWidth] = useState(rinkWidth);
  const [plotHeight, setPlotHeight] = useState(rinkDepth);

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
    width: plotWidth,
    height: plotHeight,
    margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
    xaxis: {
      range: [0, rinkDepth],
      showgrid: false,
      showline: false,
      fixedrange: true,
      visible: false
    },
    yaxis: {
      range: [0, rinkWidth],
      showgrid: false,
      showline: false,
      fixedrange: true,
      scaleanchor: "x",
      scaleratio: 1,
      visible: false
    },
    images: [
      {
        source: rinkImage,
        xref: "x",
        yref: "y",
        x: 0,
        y: 0,
        sizex: rinkDepth,
        sizey: rinkWidth,
        opacity: 1,
        layer: "top",
        xanchor: "left",
        yanchor: "bottom",
      },
    ],
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  return (
    <div id="rink-graph-container" className="RinkGraph">
      <Plot
        data={data}
        layout={layout}
        config={{displayModeBar: false}}
        useResizeHandler
        className="RinkGraphPlot"
      />
    </div>
  );
};

export default RinkGraph;
