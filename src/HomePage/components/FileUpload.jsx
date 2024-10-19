// src/HomePage/components/FileUpload.jsx
import React, { useState } from 'react';
import { firestore } from '../../index'; // Import the Firestore instance
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore'; // Firestore functions
import Papa from 'papaparse'; // A library to parse CSV files

import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState(''); // State for first name input
  const [lastName, setLastName] = useState(''); // State for last name input

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('No file selected. Please upload a file before submitting.');
      return;
    }

    // Check if first name and last name are provided
    if (!firstName || !lastName) {
      alert('Please enter both first and last names.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvData = event.target.result; // Get the CSV data as text

      // Split the data into lines and skip the first line
      const lines = csvData.split('\n').slice(2).join('\n'); // Skip the "Notes" line

      // Parse the remaining lines starting from the header
      const parsedData = Papa.parse(lines, {
        header: true,
        skipEmptyLines: true,
        transform: (value) => {
          // Trim whitespace for each field
          return value.trim();
        },
      }).data;

      // Create a user object to hold connections' IDs
      const user = {
        connectionIds: [], // Store only the connection document IDs
        first_name: firstName,
        last_name: lastName,
      };

      // Loop through the parsed data and prepare connection entries
      for (const row of parsedData) {
        // Prepare the data object for each connection
        const connection = {
          first_name: row['First Name'] || '',
          last_name: row['Last Name'] || '',
          url: row['URL'] || '',
          email_address: row['Email Address'] || '',
          company: row['Company'] || '',
          position: row['Position'] || '',
          connected_on: row['Connected On'] || '',
        };

        // Query Firestore to check if the connection already exists
        const q = query(
          collection(firestore, 'connections'),
          where('url', '==', connection.url),
        );
        const querySnapshot = await getDocs(q);

        try {
          if (!querySnapshot.empty) {
            // If a matching document exists, update it
            const existingDocRef = querySnapshot.docs[0].ref; // Get the reference of the existing document
            await setDoc(existingDocRef, connection); // Update the existing document with new data
            user.connectionIds.push(existingDocRef.id); // Add the connection's document ID to the user object
          } else {
            // If it's a new connection, add it to Firestore
            const connectionDocRef = doc(collection(firestore, 'connections'));
            await setDoc(connectionDocRef, connection); // Save the new connection object to Firestore
            user.connectionIds.push(connectionDocRef.id); // Add the new connection's document ID to the user object
          }

        } catch (error) {
          console.error('Error adding/updating document: ', error);
        }
      }

      // Create or clear the user's connectionIds and add first and last name
      const userDocRef = doc(collection(firestore, 'people')); // Get reference to user document
      await setDoc(userDocRef, { 
        ...user, 
        first_name: user.first_name, 
        last_name: user.last_name 
      }); // Reset connectionIds for the user

      // Finally, update the user document with the new list of connection IDs
      try {
        await setDoc(userDocRef, user); // Save the user object with updated connection IDs
      } catch (error) {
        console.error('Error adding user document: ', error);
      }

      alert('Data uploaded successfully to Firestore.');
      setFile(null); // Reset the file state after submission
      setFirstName(''); // Reset the first name state
      setLastName(''); // Reset the last name state
    };

    reader.onerror = (error) => {
      console.error('Error reading file: ', error);
      alert('Error reading file. Please try again.');
    };

    reader.readAsText(file); // Read the file as text
  };


  return (
    <div className={'input-container'}>
      <input 
        type="text" 
        placeholder="First Name" 
        value={firstName} 
        onChange={(e) => setFirstName(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Last Name" 
        value={lastName} 
        onChange={(e) => setLastName(e.target.value)} 
      />
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {file && (
        <button onClick={handleSubmit}>Submit</button>
      )}
    </div>
  );

};

export default FileUpload;
