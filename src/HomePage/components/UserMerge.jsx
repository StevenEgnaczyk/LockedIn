import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../../index';  // Importing firestore and auth
import { collection, getDocs } from 'firebase/firestore'; 
import { useGraphData } from './GraphDataContext';  // Import the custom hook

import './UserMerge.css';

const UserMerge = () => {
  const { setGraphData } = useGraphData();  // Get the setGraphData function from the custom hook
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeUser, setActiveUser] = useState(null); 

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
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchActiveUser = () => {
      const user = auth.currentUser;  // Get the current user
      if (user) {
        setActiveUser(user.uid); // Set the active user's UID
      }
    };

    fetchUsers();
    fetchActiveUser();
  }, []);

  useEffect(() => {
    if (activeUser) {
      const selectedActiveUser = users.find(user => user.uid === activeUser);
      if (selectedActiveUser && !selectedUsers.includes(selectedActiveUser.id)) {
        setSelectedUsers(prevSelected => [...prevSelected, selectedActiveUser.id]);
      }
    }
  }, [activeUser, users]);

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

  const fetchAllConnections = async () => {
    const connectionsCollection = collection(firestore, 'connections');
    const connectionsSnapshot = await getDocs(connectionsCollection);
    return connectionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  };

  const generateGraph = async () => {
    const selectedUserData = users.filter(user => selectedUsers.includes(user.id));
    const allConnectionsList = findAllConnections(selectedUserData);
    const allConnectionData = await fetchAllConnections();

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

    const nodes = allConnectionData
      .filter(conn => allConnectionsList.includes(conn.id))
      .map(conn => ({
        id: conn.id,
        name: `${conn.first_name} ${conn.last_name}`,
        profile_url: conn.url,
        company: conn.company,
        connected_on: conn.connected_on,
        position: conn.position,
        email: conn.email_address,
        connections: []
      }));

    const selectedNodes = selectedUserData.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      connections: [],
      connectionCount: 0,
    }));

    const allNodes = [...new Map([...selectedNodes, ...nodes].map(item => [item.id, item])).values()];

    const connectionCountMap = new Map();

    selectedUserData.forEach(user => {
        user.connectionIds.forEach(connectionId => {
            connectionCountMap.set(connectionId, (connectionCountMap.get(connectionId) || 0) + 1);
        });
    });

    const links = [];
    selectedUserData.forEach(user => {
        user.connectionIds.forEach(connectionId => {
            const thickness = connectionCountMap.get(connectionId) || 1; // Default to 1 if no connections
            links.push({
                source: user.id,
                target: connectionId,
                thickness: thickness
            });

            // Add connection to the nodes
            const sourceNode = allNodes.find(node => node.id === user.id);
            const targetNode = allNodes.find(node => node.id === connectionId);

            if (sourceNode && targetNode && !sourceNode.connections.includes(targetNode.id)) {
                sourceNode.connections.push(targetNode.id);
            }
        });
    });

    const graphData = {
        nodes: allNodes,
        links: links
    };

    setGraphData(graphData);
    saveGraphDataToFile(graphData);
};

  const saveGraphDataToFile = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graphData.json';
    a.click();
    URL.revokeObjectURL(url);
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
    <div className={'user-merge-container'}>
      <h2>Select Users to Merge</h2>
      {users.map(user => (
        <div key={user.id} className="user-row">
          <label htmlFor={user.id}>{user.first_name} {user.last_name}</label>
          <input
            type="checkbox"
            id={user.id}
            checked={selectedUsers.includes(user.id)}
            onChange={() => handleCheckboxChange(user.id)}
          />
        </div>
      ))}
      <button onClick={generateGraph} disabled={selectedUsers.length < 2}>
        Find Mutual Connections and Generate Graph
      </button>
    </div>
  );
};

export default UserMerge;
