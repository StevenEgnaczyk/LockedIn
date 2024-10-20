import './App.css';
import React, { useEffect, useRef, useState } from "react";
import { useGraphData } from "./HomePage/components/GraphDataContext";
import ForceGraph3D from "react-force-graph-3d";
import NavBarLeft from "./HomePage/components/NavBarLeft";
import Startup from "./HomePage/components/Startup";
import UploadBar from "./HomePage/components/UploadBar";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import FakeComponent from "./HomePage/components/FakeComponent";
import NavBarRight from "./HomePage/components/NavBarRight";
import FocusGraph from './FocusGraph';
import PositionControls from './HomePage/components/PositionControls'; // Import PositionControls

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const graphRef = useRef();

  const handleLogin = () => {
    setIsLoggedIn(true);
  }

  return (
    <div className={'page'}>
      <div style={{ width: '100vw', height: '100vh', margin: 0 }}>
        <FocusGraph ref={graphRef} />
        {!isLoggedIn && (
          <div className={"startup"}>
            <Startup onLogin={handleLogin} />
          </div>
        )}
        <div className={'dot'}>.</div>
        {isLoggedIn && (
          <div>
            <div className={"navbarright"}>
              <NavBarRight />
            </div>
            <div className={"navbarleft"}>
              <NavBarLeft />
            </div>
            <div className={'position-controls'}>
              <PositionControls resetCamera={graphRef.current?.reset} /> {/* Pass resetCamera prop */}
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-center" />
      <FakeComponent />
    </div>
  );
}

export default App;
