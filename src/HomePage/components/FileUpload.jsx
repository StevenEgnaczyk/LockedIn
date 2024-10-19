// src/HomePage/components/FileUpload.jsx
import React, { useState } from 'react';
import { firestore } from '../../index'; // Import the Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import Papa from 'papaparse'; // A library to parse CSV files

const FileUpload = () => {
  const [file, setFile] = useState(null);

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

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvData = event.target.result; // Get the CSV data as text
      // Parse the CSV data and skip the first two rows
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

      // Loop through the parsed data and save each entry to Firestore
      for (const row of parsedData) {

        console.log('Row:', row);
        // Extract data based on the provided structure
        const firstName = row["First Name"] || "";
        const lastName = row["Last Name"] || "";
        const url = row["URL"] || "";
        const emailAddress = row["Email Address"] || "";
        const company = row["Company"] || "";
        const position = row["Position"] || "";
        const connectedOn = row["Connected On"] || "";

        console.log(firstName);

        // Prepare the data object to send to Firestore
        const dataToSend = {
          first_name: firstName || '',
          last_name: lastName,
          url: url,
          email_address: emailAddress,
          company: company,
          position: position,
          connected_on: connectedOn,
        };

        console.log(firstName);

        // Check if any required fields are missing
        if (!dataToSend.first_name || !dataToSend.last_name) {
          console.warn('Missing required fields:', dataToSend);
          continue; // Skip this row if required fields are missing
        }

        try {
          await addDoc(collection(firestore, 'linkedin_data'), dataToSend);
        } catch (error) {
          console.error('Error adding document: ', error);
        }
      }

      alert('Data uploaded successfully to Firestore.');
      setFile(null); // Reset the file state after submission
    };

    reader.onerror = (error) => {
      console.error('Error reading file: ', error);
      alert('Error reading file. Please try again.');
    };

    reader.readAsText(file); // Read the file as text
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {file && (
        <button onClick={handleSubmit}>Submit</button>
      )}
    </div>
  );
};

export default FileUpload;
