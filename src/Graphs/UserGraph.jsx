import React, { useEffect, useState } from 'react';
import ForceGraph3D from "react-force-graph-3d";

const GraphDisplay = () => {
  const [graphData, setGraphData] = useState(null);

  // Load JSON file data (assuming the JSON is available locally or from an API)
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        // If the JSON file is local, you can use a fetch request
        const response = await fetch('./connections_graph.json');  // Replace with actual path
        const data = await response.json();
        setGraphData(data);
      } catch (error) {
        console.error('Error loading graph data:', error);
      }
    };

    fetchGraphData();
  }, []);

  if (!graphData) {
    return <div>Loading graph...</div>;
  }

  return (
    <div>
      <h2>Connection Graph</h2>
      <ForceGraph3D
        graphData={graphData}  // Pass the nodes data
        nodeAutoColorBy="id"   // Color nodes by their ID
        nodeLabel={node => `${node.name}`} // Show name as node label
        nodeRelSize={8}        // Set node size
        linkDirectionalParticles={2}  // Show particles along the links
        linkDirectionalParticleSpeed={d => 0.004}  // Particle speed
        width={800}            // Set width of the canvas
        height={600}           // Set height of the canvas
      />
    </div>
  );
};

export default GraphDisplay;
