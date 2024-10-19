import os
import pandas as pd
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask app
app = Flask(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate('path/to/your/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Read the CSV file into a DataFrame
    df = pd.read_csv(file)

    # Iterate over the rows in the DataFrame and save each entry to Firestore
    for index, row in df.iterrows():
        data = {
            'first_name': row['First Name'],
            'last_name': row['Last Name'],
            'url': row['URL'],
            'email_address': row['Email Address'],
            'company': row['Company'],
            'position': row['Position'],
            'connected_on': row['Connected On']
        }
        
        # Add data to Firestore (you can specify a collection name)
        db.collection('linkedin_data').add(data)

    return jsonify({'message': 'File successfully uploaded and data saved to Firestore'}), 200

if __name__ == '__main__':
    app.run(debug=True)
