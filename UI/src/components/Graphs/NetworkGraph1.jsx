import React, { useRef, useEffect } from "react";
import { ForceGraph3D } from "react-force-graph";
import SpriteText from "three-spritetext";

const NetworkGraph1 = ({ graphData }) => {
  const fgRef = useRef();

  // Fit the graph to the canvas on mount
  useEffect(() => {
    fgRef.current.zoomToFit(1000, 100);
  }, [graphData]);

  return (
    <div style={{ width: "100%", height: "600px", margin: "0 auto" }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={(d) => d.value * 0.001}
        linkCurvature={0.25}
        linkWidth={(link) => Math.sqrt(link.value)}
        linkColor={() => "rgba(255, 255, 255, 0.6)"}
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(node.id);
          sprite.color = node.color || "white";
          sprite.textHeight = 8;
          return sprite;
        }}
      />
    </div>
  );
};

export default NetworkGraph1;
