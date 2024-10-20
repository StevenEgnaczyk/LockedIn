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
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
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
      // Select the active user by their UID and check if they are in the user list
      const selectedActiveUser = users.find(user => user.uid === activeUser);
      if (selectedActiveUser) {
        setSelectedUsers(prevSelected => {
          // Ensure the active user is checked
          if (!prevSelected.includes(selectedActiveUser.id)) {
            return [...prevSelected, selectedActiveUser.id];
          }
          return prevSelected;
        });
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

    // Prepare nodes for the JSON structure
    const nodes = allConnectionData
      .filter(conn => allConnectionsList.includes(conn.id))
      .map(conn => ({
        id: conn.id,
        name: `${conn.first_name} ${conn.last_name}`,
        profile_url: `${conn.url}`,
        company: `${conn.company}`,
        connected_on: `${conn.connected_on}`,
        position: `${conn.position}`,
        email: `${conn.email_address}`,
      }));

    // Add selected users to nodes as well
    const selectedNodes = selectedUserData.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`  // Combine first and last names
    }));

    // Merge selected users into nodes
    const allNodes = [...new Map([...selectedNodes, ...nodes].map(item => [item.id, item])).values()];

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

    // Set the graph data in the context
    setGraphData(graphData);
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
