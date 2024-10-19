import './App.css';
import LoginGraph from "./Graphs/LoginGraph";
import React from "react";
import FileUpload from './HomePage/components/FileUpload';
import UserMerge from './HomePage/components/UserMerge';
import UserGraph from './Graphs/UserGraph';


function App() {
  return (
    <div>
      <FileUpload />
      <UserMerge />
      <LoginGraph />
      <UserGraph />
      <div>test</div>
    </div>
  );
}

export default App;
