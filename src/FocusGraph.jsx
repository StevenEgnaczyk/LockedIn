import React, { useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { useGraphData } from './HomePage/components/GraphDataContext';

const FocusGraph = forwardRef((props, ref) => {
  const fgRef = useRef();
  const { graphData, setGraphData } = useGraphData();

  const handleClick = useCallback(
    (node) => {
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt
        3000 // ms transition duration
      );
    },
    [fgRef]
  );

  // Function to handle right-click on a node
  const handleRightClick = useCallback((node) => {
    if (node.profile_url) {
      window.open(node.profile_url, '_blank'); // Open the URL in a new tab
    }
  }, []);

  // Define the reset function
  const resetCamera = useCallback(() => {
    // Reset to a default camera position
    fgRef.current.cameraPosition({ x: 0, y: 0, z: 500 }, { x: 0, y: 0, z: 0 }, 3000); // Customize this based on your needs
  }, []);

  // Expose the reset function to parent components
  useImperativeHandle(ref, () => ({
    reset: resetCamera,
  }));

  useEffect(() => {
    // Only fetch data if graphData is not available
    if (!graphData) {
      fetch('./miserables.json')
        .then((res) => res.json())
        .then((data) => {
          setGraphData(data); // Set the fetched data to context
        });
    }
  }, [graphData, setGraphData]);

  if (!graphData || !graphData.nodes || !graphData.links) {
    return <div>Loading...</div>;
  }

  graphData.nodes.forEach(node => {
    console.log(`Node ID: ${node.id}, Size: ${node.size}`);
  });

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0 }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeId="id"
        nodeAutoColorBy="position"
        nodeLabel="name"
        showNavInfo={false}
        nodeOpacity={0.8}
        enableNodeDrag={false}
        nodeVal={node => Math.sqrt(node.size) / 2} // Set node size based on size property
        onNodeClick={handleClick}
        onNodeRightClick={handleRightClick} // Add right-click handler
        linkWidth={link => link.thickness} // Use the thickness property
        linkDirectionalParticles={10}
        linkDirectionalParticleWidth={1}
        linkDirectionalParticleSpeed={0.01}
        linkOpacity={0.1}
        backgroundColor="black"
      />
    </div>
  );
});

export default FocusGraph;
