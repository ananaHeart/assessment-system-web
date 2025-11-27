import React, { useState } from 'react';
import { enrollmentService } from '../services/api';

const EnrollmentUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleParse = async () => {
    if (!file) return;
    try {
      const response = await enrollmentService.parseFile(file);
      console.log('Parsed:', response.data);
      // Handle success (e.g., show preview, call save)
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data || 'Failed to parse file');
      if (err.response?.status === 403) {
        setError('Access denied. Please log in again.');
        // Redirect to login
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".xlsx" />
      <button onClick={handleParse}>Parse Enrollment</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default EnrollmentUpload;