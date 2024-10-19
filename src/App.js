import './App.css';
import React, {useEffect, useRef, useState} from "react";
import ForceGraph3D from "react-force-graph-3d";
import NavBarLeft from "./HomePage/components/NavBarLeft";
import Startup from "./HomePage/components/Startup";
import UploadBar from "./HomePage/components/UploadBar";

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
  const fakeData = generateFakeData(250, 500);
  const graphRef = useRef();
  let angle = 0;

  const rotateGraph = () => {
    if (graphRef.current) {
      // Rotate the whole scene except for the central node
      const rotationSpeed = 0.01;
      graphRef.current.scene().rotation.y = angle;
      angle += rotationSpeed;
    }
  };

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.cameraPosition(
        { x: 0, y: 0, z: 800 },
        { x: 0, y: 0, z: 0 },
        3000
      );
    }

    const interval = setInterval(rotateGraph, 25); // Rotate every 50ms
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  }

  const realData = generateFakeData(10, 10);

  return (
    <div style={{ position: 'relative' }}>
      <ForceGraph3D
        ref={graphRef}
        graphData={isLoggedIn ? (realData) : (fakeData)}
        nodeId="id"
        nodeLabel={node => `${node.name}`} // Display the name on hover
        linkDirectionalArrowLength={5}
        linkDirectionalArrowColor="red"
      />
      <div className={"navbar"}>
        <NavBarLeft />
      </div>
      {!isLoggedIn && <div className={"startup"}>
        <Startup onLogin={handleLogin}/>
      </div>}
      <div className={'dot'}>.</div>
      <div className={"upload-bar"}>
        <UploadBar />
      </div>
    </div>
  );
}

export default App;
