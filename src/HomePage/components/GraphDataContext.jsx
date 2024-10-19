import React, { createContext, useContext, useState } from 'react';

// Create a context for graph data
const GraphDataContext = createContext();

// Custom provider component
export const GraphDataProvider = ({ children }) => {
  const [graphData, setGraphData] = useState(null);
  
  return (
    <GraphDataContext.Provider value={{ graphData, setGraphData }}>
      {children}
    </GraphDataContext.Provider>
  );
};

// Custom hook for using graph data context
export const useGraphData = () => {
  return useContext(GraphDataContext);
};
