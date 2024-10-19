import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../../index';  // Importing firestore and auth
import { collection, getDocs } from 'firebase/firestore'; 
import Papa from 'papaparse';  // Import PapaParse for CSV export
import { useGraphData } from './GraphDataContext';  // Import the custom hook

const UserMerge = () => {
  const { setGraphData } = useGraphData();  // Get the setGraphData function from the custom hook
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [mergedData, setMergedData] = useState(null);
  const [mutualConnections, setMutualConnections] = useState([]);
  const [allConnections, setAllConnections] = useState([]);
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
