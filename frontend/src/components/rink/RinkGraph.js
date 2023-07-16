import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

import updateItemSizeAspectRatio from "../../utilities/aspectRatio"
import "./RinkGraph.css";
import rinkImage from "../../assets/rink.png";

// Rink constants
const id = "rink-graph-container";
const rinkWidth = 200;
const rinkDepth = 85;
const aspectRatio =  rinkWidth / rinkDepth;

const RinkGraph = ({data}) => {
  const [plotWidth, setPlotWidth] = useState(rinkWidth);
  const [plotHeight, setPlotHeight] = useState(rinkDepth);

  // force rink display aspect ratio to stay constant
  useEffect(() => {
    updateItemSizeAspectRatio(id, aspectRatio, setPlotWidth, setPlotHeight);
    window.addEventListener("resize", updateItemSizeAspectRatio);
    return () => window.removeEventListener("resize", updateItemSizeAspectRatio);
  }, []);

  // plotly rink layout
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
    <div id={id} className="RinkGraph">
      <Plot
        data={data}
        layout={layout}
        config={{displayModeBar: false}}
        useResizeHandler
      />
    </div>
  );
};

export default RinkGraph;
