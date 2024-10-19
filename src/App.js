import './App.css';
import LoginGraph from "./Graphs/LoginGraph";
import React from "react";
import FileUpload from './HomePage/components/FileUpload';


function App() {
  return (
    <div>
              <FileUpload />

        <LoginGraph />
        <div>test</div>
    </div>
  );
}

export default App;
