import './App.css';
import React, { useEffect, useRef, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import Login from './HomePage/components/Login'; // Make sure the path is correct
import NavBarLeft from './HomePage/components/NavBarLeft';  // Import your NavBar component
import UploadBar from './HomePage/components/UploadBar';    // Import your UploadBar component

const generateFakeData = (nodeCount = 10, linkCount = 15) => {
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: `user_${i}`,
      name: `User ${i}`,
    }));
  
    const links = Array.from({ length: linkCount }, () => {
      const source = Math.floor(Math.random() * nodeCount);
      let target = Math.floor(Math.random() * nodeCount);
  
      while (target === source) {
        target = Math.floor(Math.random() * nodeCount);
      }
  
      return {
        source: `user_${source}`,
        target: `user_${target}`,
      };
    });
    return { nodes, links };
};
  
const App = () => {
    const [graphData, setGraphData] = useState(generateFakeData(250, 500));
    const graphRef = useRef();
    let angle = 0;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    const rotateGraph = () => {
      if (graphRef.current) {
        const rotationSpeed = 0.01;
        graphRef.current.scene().rotation.y = angle;
        angle += rotationSpeed;
      }
    };
  
    useEffect(() => {
      if (graphRef.current) {
        graphRef.current.cameraPosition(
          { x: 0, y: 0, z: 800 },  // Initial zoom level
          { x: 0, y: 0, z: 0 },
          3000
        );
      }
      const interval = setInterval(rotateGraph, 25);
      return () => clearInterval(interval);
    }, []);
  
    const handleZoom = (zoomLevel) => {
      if (graphRef.current) {
        graphRef.current.cameraPosition(
          { x: 0, y: 0, z: zoomLevel },  // Zoom to this level
          { x: 0, y: 0, z: 0 },
          3000                          // Transition duration in milliseconds
        );
      }
    };
  
    const handleLogin = () => {
      setIsLoggedIn(true);  
      removeNode();
      generateFakeData();
      handleZoom(500);      
    };

    const removeNode = (nodeId) => {
        setGraphData(prevData => {
          const filteredNodes = prevData.nodes.filter(node => node.id !== nodeId);
          const filteredLinks = prevData.links.filter(link => link.source !== nodeId && link.target !== nodeId);
  
          return {
            nodes: filteredNodes,
            links: filteredLinks
          };
        });
      };
  
    return (
      <div style={{ position: 'relative', height: '100vh' }}>
        {/* 3D Graph always visible in the background */}
        <ForceGraph3D
          ref={graphRef}
          graphData={graphData}
          nodeId="id"
          nodeLabel={node => `${node.name}`}
          linkDirectionalArrowLength={5}
          linkDirectionalArrowColor="red"
        />

        {/* Conditionally render NavBar and UploadBar after login */}
        {isLoggedIn && (
          <>
            <div className={"navbar"}>
              <NavBarLeft />
            </div>
            <div className={"upload-bar"}>
              <UploadBar />
            </div>
          </>
        )}

        {/* Conditionally render login form */}
        {!isLoggedIn && (
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent overlay
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Login onLogin={handleLogin} />
          </div>
        )}
      </div>
    );
}

export default App;
