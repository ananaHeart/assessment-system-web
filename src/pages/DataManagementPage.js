import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '../services/api';
import Sidebar from '../components/layout/PrincipalDashboard/Sidebar';
import './DataManagementPage.css';

const DataManagementPage = () => {
    const [mode, setMode] = useState('upload');
    const [fileToUpload, setFileToUpload] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [columnMapping, setColumnMapping] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [error, setError] = useState('');

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;
        setFileToUpload(file);
        setError('');
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await api.import.analyze(formData);
            setHeaders(response.data);
            setMode('mapping');
        } catch (err) {
            setError('Failed to analyze file.');
            console.error(err);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ 
        onDrop, 
        accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
    });

    const handleProcessFile = async () => {
        if (!fileToUpload || !columnMapping.firstName || !columnMapping.lastName || !columnMapping.email) {
            setError('Please map all required fields');
            return;
        }
        setError('');
        
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('mapping', JSON.stringify(columnMapping));
        
        try {
            await api.import.process(formData);
            alert('File processed successfully!');
            setMode('upload');
            setFileToUpload(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Import failed.');
            console.error(err);
        }
    };

    const handleMappingChange = (e) => {
        const { name, value } = e.target;
        setColumnMapping(prevState => ({ ...prevState, [name]: value }));
    };

    const renderUploadView = () => (
        <div className="upload-view">
            <h3>Import Teacher Data</h3>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag & drop file here, or click to select</p>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );

    const renderMappingView = () => (
        <div className="mapping-view">
            <h3>Column Mapping</h3>
            <div className="mapping-form">
                <div className="form-group">
                    <label>First Name</label>
                    <select name="firstName" value={columnMapping.firstName} onChange={handleMappingChange}>
                        <option value="">-- Select --</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <select name="lastName" value={columnMapping.lastName} onChange={handleMappingChange}>
                        <option value="">-- Select --</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <select name="email" value={columnMapping.email} onChange={handleMappingChange}>
                        <option value="">-- Select --</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="form-actions">
                <button className="btn btn-back" onClick={() => { setMode('upload'); setFileToUpload(null); }}>Cancel</button>
                <button className="btn btn-secondary" onClick={handleProcessFile}>Process File</button>
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