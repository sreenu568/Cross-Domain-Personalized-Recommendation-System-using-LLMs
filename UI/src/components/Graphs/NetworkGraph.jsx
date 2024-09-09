import React, { useState, useCallback } from "react";
import { Graph } from "react-d3-graph";
import * as d3 from "d3";

const NetworkGraph = ({
  Books = {},
  Beauty = {},
  Fashion = {},
  Phones = {},
  Movies = {},
  Booksb = {},
  Beautyb = {},
  Fashionb = {},
  Phonesb = {},
  Moviesb = {},
}) => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphInstance, setGraphInstance] = useState(null);

  // Helper function to truncate text to a maximum of 3 words
  const truncateText = (text) => {
    if (!text) return text;
    const words = text.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + "...";
    }
    return text;
  };

  const aggregateData = () => {
    const domainData = { Books, Beauty, Fashion, Phones, Movies };
    const bestProductData = { Booksb, Beautyb, Fashionb, Phonesb, Moviesb };
    const graphData = {
      nodes: [
        {
          id: "User",
          color: "#4A90E2", // Blue for User node
          image: "https://via.placeholder.com/60?text=User",
          symbolType: "diamond",
        },
      ],
      links: [],
    };

    const domainNodes = new Set();

    Object.keys(domainData).forEach((domain) => {
      const domainProducts = domainData[domain];
      const bestProduct = bestProductData[`${domain}b`];
      if (domainProducts) {
        if (!domainNodes.has(domain)) {
          graphData.nodes.push({
            id: domain,
            color: "#2ECC71", // Green for Domain nodes
            group: "Domain",
            image: `https://via.placeholder.com/60?text=${domain}`,
            symbolType: "square",
          });
          domainNodes.add(domain);

          graphData.links.push({
            source: "User",
            target: domain,
          });
        }

        Object.keys(domainProducts).forEach((key) => {
          const product = domainProducts[key];
          if (product && product["product name"]) {
            const fullName = product["product name"];
            const truncatedName = truncateText(fullName);
            const isBestProduct =
              bestProduct &&
              truncateText(bestProduct["product 1"]["product name"]) ===
                truncatedName;

            // Validate that product has an ID before adding it to nodes
            if (fullName) {
              graphData.nodes.push({
                id: truncatedName,
                fullName: fullName, // Store the full name
                color: isBestProduct ? "#E74C3C" : "#F39C12", // Red for best product
                explanation: product["reason"],
                image: product["image link"],
                symbolType: isBestProduct ? "star" : "circle",
              });

              // Validate that the domain and product name are not undefined
              if (domain && truncatedName) {
                graphData.links.push({
                  source: domain,
                  target: truncatedName,
                });
              }
            }
          }
        });

        if (
          bestProduct &&
          bestProduct["product name"] &&
          !graphData.nodes.some(
            (node) => node.id === truncateText(bestProduct["product name"])
          )
        ) {
          const fullName = bestProduct["product name"];
          const truncatedBestName = truncateText(fullName);
          graphData.nodes.push({
            id: truncatedBestName,
            fullName: fullName, // Store the full name
            color: "#E74C3C", // Red for Best Product
            explanation: bestProduct["reason"],
            image: bestProduct["image link"],
            symbolType: "circle",
          });

          // Validate that the domain and bestProduct name are not undefined
          if (domain && bestProduct["product 1"]["product name"]) {
            graphData.links.push({
              source: domain,
              target: truncatedBestName,
              label: "Best Product",
            });
          }
        }
      }
    });

    return graphData;
  };

  const graphData = aggregateData();

  const config = {
    nodeHighlightBehavior: true,
    linkHighlightBehavior: true,
    highlightOpacity: 0,
    panAndZoom: true,
    maxZoom: 3,
    minZoom: 0,
    node: {
      size: 800,
      highlightStrokeColor: "#FF6347",
      highlightStrokeWidth: 3,
      labelProperty: "id",
      fontSize: 14,
      fontColor: "#2C3E50",
      fontWeight: "normal",
      opacity: 0.9,
      borderColor: "#34495E",
      borderWidth: 3,
      highlightFontSize: 16,
      highlightFontColor: "#34495E",
    },
    link: {
      highlightColor: "#FF6347",
      renderLabel: true,
      labelProperty: "label",
      fontSize: 14,
      fontColor: "#2C3E50",
      strokeWidth: 3,
      arrowHeadSize: 7,
      type: "CURVE_SMOOTH",
    },
    collapsible: true,
    automaticRearrangeAfterDropNode: false,
    directed: true,
    height: 1000,
    width: 1300,
    d3: {
      gravity: -500,
      zoom: {
        enabled: true,
        minZoom: 0.3,
        maxZoom: 5,
      },
    },
  };

  const handleGraphUpdated = useCallback(() => {
    if (graphInstance && graphInstance.refs && graphInstance.refs.svg) {
      const svg = d3.select(graphInstance.refs.svg);

      svg.selectAll("image").remove();

      graphData.nodes.forEach((node) => {
        const nodeSelection = svg
          .selectAll("g.node")
          .filter((d) => d.id === node.id);

        nodeSelection
          .append("svg:image")
          .attr("xlink:href", node.image)
          .attr("x", -30)
          .attr("y", -30)
          .attr("width", 80)
          .attr("height", 80)
          .attr("clip-path", "url(#clip-path)");
      });

      svg
        .append("defs")
        .append("clipPath")
        .attr("id", "clip-path")
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 30);
    }
  }, [graphInstance, graphData]);

  const handleMouseOverLink = (source, target) => {
    const linkInfo = graphData.links.find(
      (link) => link.source === source && link.target === target
    );
    setHoveredLink(linkInfo ? linkInfo.label : null);
  };

  const handleMouseOutLink = () => {
    setHoveredLink(null);
  };

  const handleClickNode = (nodeId) => {
    const nodeInfo = graphData.nodes.find((node) => node.id === nodeId);
    setSelectedNode(nodeInfo);

    if (graphInstance && graphInstance.d3) {
      const nodeElement = d3.select(graphInstance.d3.select(`.node#${nodeId}`));
      if (!nodeElement.empty()) {
        nodeElement.transition().duration(300).attr("fill", "#ff4500");
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4 pb-10 border-gray-300">
        Network Analysis of Top and Best Products in Different Domains
      </h1>

      <Graph
        id="network-graph"
        data={graphData}
        config={config}
        ref={setGraphInstance}
        onClickNode={handleClickNode}
        onMouseOverLink={handleMouseOverLink}
        onMouseOutLink={handleMouseOutLink}
      />
      <div>
        {selectedNode && (
          <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <img
              src={selectedNode.image}
              alt={selectedNode.id}
              className="w-14.5 h-1/2 object-cover rounded-lg"
            />
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Product Info
            </h3>
            <div className="mb-2">
              <p className="font-semibold text-gray-700">Full Name</p>
              <p className="text-gray-900">{selectedNode.fullName}</p>
            </div>
            <div className="mb-2">
              <p className="font-semibold text-gray-700">Explanation:</p>
              <p className="text-gray-900">{selectedNode.explanation}</p>
            </div>
          </div>
        )}

        {hoveredLink && (
          <div>
            <h3>Link Info</h3>
            <p>{hoveredLink}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkGraph;
