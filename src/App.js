import './App.css';
import React, {useEffect, useRef, useState} from "react";
import { useGraphData } from "./HomePage/components/GraphDataContext";
import ForceGraph3D from "react-force-graph-3d";
import NavBarLeft from "./HomePage/components/NavBarLeft";
import Startup from "./HomePage/components/Startup";
import PositionControls from './HomePage/components/PositionControls'
import UploadBar from "./HomePage/components/UploadBar";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import FakeComponent from "./HomePage/components/FakeComponent";
import { sendEmailVerification } from 'firebase/auth';

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

  const { graphData } = useGraphData();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);

  const fakeData = generateFakeData(250, 500);
  const graphRef = useRef();
  let angle = 0;

  const rotateGraph = () => {
    if (graphRef.current) {
      graphRef.current.scene().rotation.y = angle;
      angle += rotationSpeed;
    }
  };

  const resetCameraPosition = () => {
    if (graphRef.current) {
      graphRef.current.cameraPosition(
          { x: 0, y: 0, z: 1000 },
          { x: 0, y: 0, z: 0 },
          3000
      );
    }
  }

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.cameraPosition(
        { x: 0, y: 0, z: 800 },
        { x: 0, y: 0, z: 0 },
        3000
      );
    }

    const interval = setInterval(rotateGraph, 10);
    return () => clearInterval(interval);
  },);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setRotationSpeed(0);
  }

  return (
    <div className={'page'}>
      <div style={{ position: 'relative' }}>
        <ForceGraph3D
            ref={graphRef}
            graphData={graphData ? (graphData) : (fakeData)}
            nodeId="id"
            nodeAutoColorBy={"id"}
            nodeLabel={node => `${node.name}`}
            showNavInfo={false}
            enableNavigationControls={isLoggedIn}
            nodeOpacity={1}
            nodeRelSize={2}
        />
        {!isLoggedIn && <div className={"startup"}>
          <Startup onLogin={handleLogin}/>
        </div>}
        <div className={'dot'}>.</div>
        {isLoggedIn && <div>
          <div className={"upload-bar"}>
            <UploadBar />
          </div>
          <div className={"navbar"}>
            <NavBarLeft />
          </div>
          <div className={'position-controls'}>
            <PositionControls resetCamera={resetCameraPosition}/>
          </div>
        </div>}
      </div>
      <ToastContainer position="top-center"/>
      <FakeComponent />
    </div>
  );
}

export default App;
