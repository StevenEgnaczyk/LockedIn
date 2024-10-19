import './App.css';
import LoginGraph from "./Graphs/LoginGraph";
import React from "react";
import FileUpload from './HomePage/components/FileUpload';
import UserMerge from './HomePage/components/UserMerge';


function App() {
  return (
    <div>
      <FileUpload />
      <UserMerge />
      <LoginGraph />
      <div>test</div>
    </div>
  );
}

export default App;
