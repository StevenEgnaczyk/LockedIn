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

  const findLinks = (selectedUserData) => {
    const links = [];
    
    // For each pair of users, check if they have any mutual connections
    for (let i = 0; i < selectedUserData.length - 1; i++) {
      const userA = selectedUserData[i];

      for (let j = i + 1; j < selectedUserData.length; j++) {
        const userB = selectedUserData[j];

        // Check if they share any mutual connection IDs
        const mutualConnections = userA.connectionIds.filter(id => userB.connectionIds.includes(id));

        console.log("Mutual Connections", mutualConnections);

        // If there are mutual connections, create links between the users
        if (mutualConnections.length > 0) {
          links.push({
            source: userA.id,
            target: userB.id
          });
        }
      }
    }

    return links;
  };

  const fetchAllConnections = async () => {
    const connectionsCollection = collection(firestore, 'connections');
    const connectionsSnapshot = await getDocs(connectionsCollection);
    return connectionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  };

  const exportToCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    console.log("Selected Users", selectedUserData);
    console.log("All Connections", allConnectionsList);
    console.log("Mutual Connections", mutualConnectionsList);


    setMutualConnections(mutualConnectionsList);

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

    // Add selected users to nodes as well
    const selectedNodes = selectedUserData.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`  // Combine first and last names
    }));

    // Merge selected users into nodes
    const allNodes = [...new Map([...selectedNodes, ...nodes].map(item => [item.id, item])).values()];

    console.log("All Nodes", allNodes);

    // Prepare links for the JSON structure
    const links = [];
    selectedUserData.forEach(user => {
      user.connectionIds.forEach(connectionId => {
        links.push({
          source: user.id,   // The selected user ID
          target: connectionId // The connection in their list
        });
      });
    });

    // Create JSON object
    const graphData = {
      nodes: allNodes,
      links: links  // Add links to the JSON object
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
