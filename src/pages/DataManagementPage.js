import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Sidebar from '../components/layout/PrincipalDashboard/Sidebar'; // Assuming this is your Principal's sidebar

const DataManagementPage = () => {
    // We only need a few states for our focused goal
    const [mode, setMode] = useState('upload'); // 'upload' or 'mapping'
    const [fileToUpload, setFileToUpload] = useState(null);
    const [headers, setHeaders] = useState([]); // To store headers from the 'analyze' step
    const [columnMapping, setColumnMapping] = useState({ // To store the user's choices
        firstName: '',
        lastName: '',
        email: ''
    });
    const [error, setError] = useState('');

    // --- API Call 1: Analyze the File ---
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setFileToUpload(file);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(
                'http://localhost:8080/api/import/analyze', // The 'analyze' endpoint
                formData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            setHeaders(response.data); // Save the returned headers
            setMode('mapping'); // Switch to the mapping UI

        } catch (err) {
            setError('Failed to analyze the file. Please ensure it is a valid .xlsx file.');
            console.error(err);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }});

    // --- API Call 2: Process the File with Mapping ---
    const handleProcessFile = async () => {
        if (!fileToUpload || !columnMapping.firstName || !columnMapping.lastName || !columnMapping.email) {
            setError('Please map all required fields: First Name, Last Name, and Email.');
            return;
        }
        setError('');

        // We need to send both the file and the mapping JSON
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('mapping', JSON.stringify(columnMapping)); // The controller expects a JSON string

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.post(
                'http://localhost:8080/api/import/process', // The 'process' endpoint
                formData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert('File processed and teachers imported successfully!');
            setMode('upload'); // Go back to the start
            setFileToUpload(null);

        } catch (err) {
            setError('Failed to process the file. Please check your mapping and try again.');
            console.error(err);
        }
    };

    const handleMappingChange = (e) => {
        const { name, value } = e.target;
        setColumnMapping(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // --- RENDER LOGIC ---

    const renderUploadView = () => (
        <div className="upload-view">
            <h3>Import Enrollment File</h3>
            <p>Upload the .xlsx file containing teacher and student data.</p>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag & drop the .xlsx file here, or click to select file</p>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );

    const renderMappingView = () => (
        <div className="mapping-view">
            <h3>Column Mapping</h3>
            <p>Match your file's columns to the required system fields.</p>
            <div className="mapping-form">
                <div className="form-group">
                    <label>Teacher First Name</label>
                    <select name="firstName" value={columnMapping.firstName} onChange={handleMappingChange}>
                        <option value="">-- Select Column --</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Teacher Last Name</label>
                    <select name="lastName" value={columnMapping.lastName} onChange={handleMappingChange}>
                        <option value="">-- Select Column --</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Teacher Email</label>
                    <select name="email" value={columnMapping.email} onChange={handleMappingChange}>
                        <option value="">-- Select Column --</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="form-actions">
                <button className="cancel-button" onClick={() => { setMode('upload'); setFileToUpload(null); }}>Cancel</button>
                <button className="import-button" onClick={handleProcessFile}>Process File</button>
            </div>
        </div>
    );

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="dashboard-header"><h1>Data Management</h1></header>
                {mode === 'upload' ? renderUploadView() : renderMappingView()}
            </main>
        </div>
    );
};

export default DataManagementPage;