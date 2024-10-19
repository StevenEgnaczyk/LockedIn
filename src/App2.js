import './App.css';
import React, {useEffect, useRef, useState} from "react";
import ForceGraph3D from "react-force-graph-3d";
import NavBarLeft from "./HomePage/components/NavBarLeft";
import Startup from "./HomePage/components/Startup";
import PositionControls from './HomePage/components/PositionControls'
import UploadBar from "./HomePage/components/UploadBar";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import FakeComponent from "./HomePage/components/FakeComponent";
import NavBarRight from "./HomePage/components/NavBarRight";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rotationSpeed] = useState(0.001);
  const [graphData, setGraphData] = useState(null);
  const [isPaused, setPaused] = useState(true);
  const [currentAngle, setCurrentAngle] = useState(0); // State to track the current angle
  const graphRef = useRef();
  const fakeData = generateFakeData(250, 500);
  const rotateGraph = () => {
    if (graphRef.current && !isPaused) {
      // Use the functional form of setCurrentAngle to ensure we have the latest value
      setCurrentAngle(prevAngle => {
        const newAngle = prevAngle + rotationSpeed; // Calculate the new angle
        graphRef.current.scene().rotation.y = newAngle; // Set the rotation
        return newAngle; // Return the new angle to update the state
      });
    }
  };
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch('./connections_graph.json');
        const data = await response.json();
        setGraphData(data);
      } catch (error) {
        console.error('Error loading graph data:', error);
      }
    };
    fetchGraphData();
  }, []);
  const resetCameraPosition = () => {
    if (graphRef.current) {
      graphRef.current.cameraPosition(
        { x: 0, y: 0, z: 1000 },
        { x: 0, y: 0, z: 0 },
        3000
      );
    }
  };
  const pauseRotation = () => {
    setPaused(prev => {
      if (!prev) {
        // If we are unpausing, set the graph to the current angle
        if (graphRef.current) {
          graphRef.current.scene().rotation.y = currentAngle; // Set the rotation to the last angle
        }
      }
      return !prev; // Toggle the paused state
    });
  };
  useEffect(() => {
    // Only set the interval if not paused
    let interval;
    if (!isPaused) {
      interval = setInterval(rotateGraph, 10);
    }
    return () => {
      clearInterval(interval); // Clear the interval on cleanup
    };
  }, [isPaused]); // Add isPaused as a dependency
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  return (
    <div className={'page'}>
      <div style={{ position: 'relative' }}>
        <ForceGraph3D
          ref={graphRef}
          graphData={isLoggedIn ? (graphData) : (fakeData)}
          nodeId="id"
          nodeAutoColorBy={"id"}
          nodeLabel={node => `${node.name}`}
          showNavInfo={false}
          enableNavigationControls={isLoggedIn}
          nodeOpacity={1}
          nodeRelSize={2}
        />
        {!isLoggedIn && <div className={"startup"}>
          <Startup onLogin={handleLogin} />
        </div>}
        <div className={'dot'}>.</div>
        {isLoggedIn && <div>
          <div className={"navbarright"}>
            <NavBarRight />
          </div>
          <div className={"navbarleft"}>
            <NavBarLeft />
          </div>
          <div className={'position-controls'}>
            <PositionControls
              resetCamera={resetCameraPosition}
              pause={pauseRotation}
            />
          </div>
        </div>}
      </div>
      <ToastContainer position="top-center" />
      <FakeComponent />
    </div>
  );
}
export default App;