import './App.css';
import React, { useEffect, useRef, useState } from "react";
import { useGraphData } from "./HomePage/components/GraphDataContext";
import ForceGraph3D from "react-force-graph-3d";
import NavBarLeft from "./HomePage/components/NavBarLeft";
import Startup from "./HomePage/components/Startup";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import FakeComponent from "./HomePage/components/FakeComponent";
import NavBarRight from "./HomePage/components/NavBarRight";
import FocusGraph from './FocusGraph';
import PositionControls from './HomePage/components/PositionControls';
import UserMerge from "./HomePage/components/UserMerge";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  const graphRef = useRef();

  const [user, setUser] = useState(null);

  const [resetCamera, setResetCamera] = useState(false); // State for resetting camera

  const handleLogin = () => {
    setIsLoggedIn(true);
  }

  const handleNodeClick = (node) => {
      setActiveNode(node);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
  };


  return (
    <div className={'page'}>
      <div style={{ width: '100vw', height: '100vh', margin: 0 }}>
        <FocusGraph nodeClick={handleNodeClick} user={user} resetCamera={resetCamera} ref={graphRef} />
        {!isLoggedIn && (
          <div className={"startup"}>
            <Startup onLogin={handleLogin} setUser={setUser} user={user}/>
          </div>
        )}
        {isLoggedIn && (
            <div>
                <UserMerge style={{display:'none'}}/>
            <div className={"navbarright"}>

              <NavBarRight setLogOut={handleLogout} />
            </div>
            <div className={"navbarleft"}>
              <NavBarLeft activeNode={activeNode}/>
            </div>
            <div className={'position-controls'}>
              <PositionControls setResetCamera={setResetCamera} /> {/* Pass resetCamera prop */}
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
