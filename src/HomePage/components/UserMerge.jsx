import React, { useState, useEffect } from 'react';
import { firestore } from '../../index';
import { collection, getDocs } from 'firebase/firestore';
import './UserMerge.css';

const UserMerge = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [mergedData, setMergedData] = useState(null);
  const [mutualConnections, setMutualConnections] = useState([]);
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

  const findMutualConnections = (selectedUserData) => {
    if (selectedUserData.length < 2) return [];

    // Assuming each user has a 'connections' field that is an array of connection IDs
    const connectionSets = selectedUserData.map(user => new Set(user.connections || []));
    
    // Find the intersection of all connection sets
    const mutualConnectionIds = connectionSets.reduce((a, b) => new Set([...a].filter(x => b.has(x))));
    
    // Filter users to only include mutual connections
    return users.filter(user => mutualConnectionIds.has(user.id));
  };

  const mergeSelectedUsers = () => {
    const selectedUserData = users.filter(user => selectedUsers.includes(user.id));
    const mutualConnectionsList = findMutualConnections(selectedUserData);
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
    <div className="user-merge-container">
      <h2 className="user-merge-header">Select Users to Merge</h2>
      {users.map(user => (
        <div key={user.id} className="user-checkbox">
          <input
            type="checkbox"
            id={user.id}
            checked={selectedUsers.includes(user.id)}
            onChange={() => handleCheckboxChange(user.id)}
          />
          <label htmlFor={user.id}>{user.first_name} {user.last_name}</label>
        </div>
      ))}
      <button onClick={mergeSelectedUsers} disabled={selectedUsers.length < 2}>
        Find Mutual Connections and Merge Data
      </button>
      {mutualConnections.length > 0 ? (
        <div className="mutual-connections">
          <h3>Mutual Connections:</h3>
          <ul>
            {mutualConnections.map(user => (
              <li key={user.id}>{user.first_name} {user.last_name}</li>
            ))}
          </ul>
        </div>
      ) : (
        selectedUsers.length >= 2 && <div>No mutual connections found.</div>
      )}
      {mergedData && (
        <div className="merged-data">
          <h3>Merged Data of Selected Users:</h3>
          <pre>{JSON.stringify(mergedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UserMerge;
