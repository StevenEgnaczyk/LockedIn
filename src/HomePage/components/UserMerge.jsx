import React, { useState, useEffect } from 'react';
import { firestore } from '../../index';
import { collection, getDocs } from 'firebase/firestore'; 
import Papa from 'papaparse';  // Import PapaParse for CSV export

const UserMerge = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [mergedData, setMergedData] = useState(null);
  const [mutualConnections, setMutualConnections] = useState([]);
  const [allConnections, setAllConnections] = useState([]);  // Store all connection names here
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const usersCollection = collection(firestore, 'people');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers(prevSelected => 
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const findAllConnections = (selectedUserData) => {
    const allConnections = new Set();

    selectedUserData.forEach(user => {
      user.connectionIds.forEach(id => allConnections.add(id));
    });

    return Array.from(allConnections);
  };

  const findMutualConnections = (selectedUserData) => {
    let commonIds = new Set(selectedUserData[0].connectionIds);

    for (let i = 1; i < selectedUserData.length; i++) {
        const currentConnectionIds = new Set(selectedUserData[i].connectionIds);
        commonIds = new Set([...commonIds].filter(id => currentConnectionIds.has(id)));
        if (commonIds.size === 0) {
            break;
        }
    }
    return Array.from(commonIds); // Return as array
  };

  const fetchAllConnections = async () => {
    const connectionsCollection = collection(firestore, 'connections');
    const connectionsSnapshot = await getDocs(connectionsCollection);
    return connectionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  };

  const exportToJSON = (jsonObject, filename) => {
    const jsonBlob = new Blob([JSON.stringify(jsonObject, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(jsonBlob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateGraph = async () => {
    const selectedUserData = users.filter(user => selectedUsers.includes(user.id));
    const mutualConnectionsList = findMutualConnections(selectedUserData);
    const allConnectionsList = findAllConnections(selectedUserData);
    const allConnectionData = await fetchAllConnections();

    // Logging for debugging
    console.log("Mutual Connections: ", mutualConnectionsList);
    console.log("All Connections Data: ", allConnectionData);

    setMutualConnections(mutualConnectionsList);

    if (mutualConnectionsList.length === 0) {
      setMergedData(null);
      return;
    }

    const mergedFields = {};
    selectedUserData.forEach(user => {
      Object.keys(user).forEach(key => {
        if (key !== 'id' && key !== 'connections') {
          if (!mergedFields[key]) {
            mergedFields[key] = new Set();
          }
          mergedFields[key].add(user[key]);
        }
      });
    });

    const finalMergedData = Object.keys(mergedFields).reduce((acc, key) => {
      acc[key] = Array.from(mergedFields[key]);
      return acc;
    }, {});

    setMergedData(finalMergedData);

    // Prepare nodes for the JSON structure
    const nodes = allConnectionData
      .filter(conn => allConnectionsList.includes(conn.id))
      .map(conn => ({
        id: conn.id,
        name: `${conn.first_name} ${conn.last_name}`  // Combine first and last names
      }));

    // Create JSON object
    const graphData = {
      nodes: nodes
    };

    // Export the JSON object
    exportToJSON(graphData, 'connections_graph.json');
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (users.length === 0) {
    return <div>No users found in the database.</div>;
  }

  return (
    <div>
      <h2>Select Users to Merge</h2>
      {users.map(user => (
        <div key={user.id}>
          <input
            type="checkbox"
            id={user.id}
            checked={selectedUsers.includes(user.id)}
            onChange={() => handleCheckboxChange(user.id)}
          />
          <label htmlFor={user.id}>{user.first_name} {user.last_name}</label>
        </div>
      ))}
      <button onClick={generateGraph} disabled={selectedUsers.length < 2}>
        Find Mutual Connections and Generate Graph
      </button>
    </div>
  );
};

export default UserMerge;
