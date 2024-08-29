// NetworkGraph.jsx
import React, { useState } from "react";
import { Graph } from "react-d3-graph";

// Sample data for the graph
const data = {
  nodes: [
    { id: "Node 1", label: "Node 1" },
    { id: "Node 2", label: "Node 2" },
    { id: "Node 3", label: "Node 3" },
  ],
  links: [
    { source: "Node 1", target: "Node 2", label: "Edge 1-2" },
    { source: "Node 2", target: "Node 3", label: "Edge 2-3" },
  ],
};

// Graph configuration
const myConfig = {
  nodeHighlightBehavior: true,
  linkHighlightBehavior: true,
  directed: true,
  node: {
    color: "lightblue",
    size: 400,
    highlightStrokeColor: "blue",
  },
  link: {
    highlightColor: "red",
    renderLabel: true,
  },
};

// NetworkGraph Component
const NetworkGraph = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  // Handle node hover event
  const onMouseOverNode = (nodeId) => {
    setHoveredNode(nodeId);
    setHoveredLink(null);
  };

  // Handle link hover event
  const onMouseOverLink = (source, target) => {
    setHoveredLink(`${source} -> ${target}`);
    setHoveredNode(null);
  };

  // Reset hover state on mouse out
  const resetHover = () => {
    setHoveredNode(null);
    setHoveredLink(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Interactive Network Graph</h2>
      <Graph
        id="graph-id"
        data={data}
        config={myConfig}
        onMouseOverNode={onMouseOverNode}
        onMouseOverLink={onMouseOverLink}
        onMouseOutNode={resetHover}
        onMouseOutLink={resetHover}
      />
      <div className="mt-4">
        {hoveredNode && (
          <div className="text-blue-600">Hovered Node: {hoveredNode}</div>
        )}
        {hoveredLink && (
          <div className="text-red-600">Hovered Edge: {hoveredLink}</div>
        )}
      </div>
    </div>
  );
};

export default NetworkGraph;
