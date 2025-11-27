import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Sidebar from '../components/layout/PrincipalDashboard/Sidebar';

const DataManagementPage = () => {
    // --- STATE MANAGEMENT ---
    const [mode, setMode] = useState('table'); // 'table', 'uploading', 'mapping', 'confirming'
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for the import process
    const [fileToUpload, setFileToUpload] = useState(null);
 
// Add these:
const [parsedData, setParsedData] = useState({
  teachers: [],      // [{email: 'jose@deped.gov.ph'}, ...]
  subjects: [],      // ['English', 'Math', ...]
  sections: [],      // ['Luna', 'Rizal', ...]
  studentsBySection: {} // {'Luna': [{'name': 'Juan', 'id': '123'}, ...], ...}
});

const [assignments, setAssignments] = useState([
  { teacherEmail: '', subject: '', section: '' }
]);

const [selectedAssignmentIndex, setSelectedAssignmentIndex] = useState(0);
const [studentCountFeedback, setStudentCountFeedback] = useState('');
    // --- DATA FETCHING ---
    const fetchClasses = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:8080/api/admin/classes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setClasses(response.data);
        } catch (err) {
            setError('Failed to fetch class data.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    // --- EVENT HANDLERS for IMPORT FLOW ---

 const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileToUpload(file);

    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const token = localStorage.getItem('jwtToken');
        // NEW ENDPOINT: /api/school-setup/process-enrollment-file
        // This endpoint should ONLY parse, not process
        const response = await axios.post(
            'http://localhost:8080/api/school-setup/process-enrollment-file/parse',
            formData,
            {
                // Do NOT set Content-Type for FormData; axios sets proper boundary automatically
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        // Response structure:
        // {
        //   teachers: [{email: '...'}, ...],
        //   subjects: ['English', 'Math'],
        //   sections: ['Luna', 'Rizal'],
        //   studentsBySection: {'Luna': [...], 'Rizal': [...]}
        // }
        
        // Validate response shape before proceeding
        const data = response.data || {};
        const valid =
            Array.isArray(data.teachers) &&
            Array.isArray(data.subjects) &&
            Array.isArray(data.sections) &&
            data.studentsBySection && typeof data.studentsBySection === 'object';

        if (!valid) {
            setError('Enrollment file parsed but returned unexpected data structure.');
            console.error('Unexpected parse response:', data);
            return;
        }

        setParsedData(data);
        setAssignments([{ teacherEmail: '', subject: '', section: '' }]);
        setMode('assignment');
    } catch (err) {
        const status = err?.response?.status;
        const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
        const msg = status ? `Failed to parse the enrollment file (HTTP ${status})` : 'Failed to parse the enrollment file.';
        setError(serverMsg ? `${msg}: ${serverMsg}` : msg);
        console.error('Parse error:', err?.response || err);
    }
}, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }});

    
    
    // --- RENDER LOGIC ---
    const handleSaveAssignments = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        
        // Send the complete payload with all assignments
        const payload = {
            assignments: assignments, // Array of {teacherEmail, subject, section}
            studentsBySection: parsedData.studentsBySection
        };
        
        await axios.post(
            'http://localhost:8080/api/school-setup/process-enrollment-file/save',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        alert('All assignments created successfully!');
        setMode('table');
        fetchClasses();
    } catch (err) {
        setError('Failed to save assignments.');
        console.error(err);
        setMode('confirming');
    }
};

    const renderConfirmContent = () => {
    return (
        <div className="confirm-view">
            <h3>Review Assignments</h3>
            <p>The following assignments will be created:</p>
            
            <div className="confirmation-list">
                {assignments.map((assignment, idx) => (
                    <div key={idx} className="confirmation-item">
                        <p>
                            <strong>Assignment {idx + 1}:</strong><br/>
                            Teacher: {assignment.teacherEmail}<br/>
                            Subject: {assignment.subject}<br/>
                            Section: {assignment.section}<br/>
                            Students: {parsedData.studentsBySection[assignment.section]?.length || 0}
                        </p>
                    </div>
                ))}
            </div>
            
            <div className="form-actions">
                <button className="cancel-button" onClick={() => setMode('assignment')}>
                    Back & Edit
                </button>
                <button className="import-button" onClick={handleSaveAssignments}>
                    Confirm & Save All
                </button>
            </div>
        </div>
    );
};
   const renderAssignmentContent = () => {
    const currentAssignment = assignments[selectedAssignmentIndex];
    
    return (
        <div className="assignment-view">
            <h3>Configure Class Assignments</h3>
            
            {/* Tabs for multiple assignments */}
            {assignments.length > 0 && (
                <div className="assignment-tabs">
                    {assignments.map((_, index) => (
                        <button
                            key={index}
                            className={`tab ${index === selectedAssignmentIndex ? 'active' : ''}`}
                            onClick={() => setSelectedAssignmentIndex(index)}
                        >
                            Assignment {index + 1}
                        </button>
                    ))}
                </div>
            )}
            
            <div className="assignment-form">
                {/* Dropdown 1: Teacher Email */}
                <div className="form-group">
                    <label>Select Teacher Email</label>
                    <select
                        value={currentAssignment.teacherEmail}
                        onChange={(e) => handleAssignmentChange(selectedAssignmentIndex, 'teacherEmail', e.target.value)}
                    >
                        <option value="">-- Choose Teacher --</option>
                        {parsedData.teachers.map((teacher, idx) => (
                            <option key={idx} value={teacher.email}>
                                {teacher.email}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Dropdown 2: Subject */}
                <div className="form-group">
                    <label>Select Subject</label>
                    <select
                        value={currentAssignment.subject}
                        onChange={(e) => handleAssignmentChange(selectedAssignmentIndex, 'subject', e.target.value)}
                    >
                        <option value="">-- Choose Subject --</option>
                        {parsedData.subjects.map((subject, idx) => (
                            <option key={idx} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Dropdown 3: Section */}
                <div className="form-group">
                    <label>Select Section</label>
                    <select
                        value={currentAssignment.section}
                        onChange={(e) => handleAssignmentChange(selectedAssignmentIndex, 'section', e.target.value)}
                    >
                        <option value="">-- Choose Section --</option>
                        {parsedData.sections.map((section, idx) => (
                            <option key={idx} value={section}>
                                {section}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Student Count Feedback */}
                {currentAssignment.section && studentCountFeedback && (
                    <div className="feedback-message">
                        ✓ {studentCountFeedback}
                    </div>
                )}
            </div>

            {/* Add Another Assignment Button */}
            <button className="secondary-button" onClick={addAnotherAssignment}>
                + Add Another Assignment
            </button>

            {/* Form Actions */}
            <div className="form-actions">
                <button className="cancel-button" onClick={() => setMode('table')}>
                    Cancel
                </button>
                <button 
                    className="import-button" 
                    onClick={() => {
                        if (validateAssignments()) {
                            setMode('confirming');
                        } else {
                            setError('Please complete all required fields.');
                        }
                    }}
                >
                    Review & Save
                </button>
            </div>
        </div>
    );
};

    const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[index][field] = value;
    setAssignments(updatedAssignments);
    
    // Show student count feedback when section is selected
    if (field === 'section' && value) {
        const studentCount = parsedData.studentsBySection[value]?.length || 0;
        setStudentCountFeedback(
            `${studentCount} students found enrolled in the '${value}' Section.`
        );
    }
};

const addAnotherAssignment = () => {
    setAssignments([...assignments, { teacherEmail: '', subject: '', section: '' }]);
    setStudentCountFeedback('');
};

const validateAssignments = () => {
    return assignments.every(a => 
        a.teacherEmail && a.subject && a.section
    );
};

   const renderTableContent = () => {
    return (
        <div className="table-view">
            <div className="table-header">
                <h3>Existing Classes</h3>
                <button className="import-button" onClick={() => setMode('uploading')}>Import new file</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {classes.length === 0 ? (
                <p>No classes found. Import data to create classes.</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Teacher</th>
                            <th>Subject</th>
                            <th>Section</th>
                            <th>Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((cls, idx) => (
                            <tr key={idx}>
                                <td>{cls.teacherEmail || cls.teacher || '-'}</td>
                                <td>{cls.subject || '-'}</td>
                                <td>{cls.section || cls.sectionName || '-'}</td>
                                <td>{cls.studentsCount ?? (cls.students?.length ?? '-')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

   const renderContent = () => {
    if (isLoading) return <p>Loading data...</p>;
    if (error && mode === 'table') return <p style={{ color: 'red' }}>{error}</p>;

    switch (mode) {
        case 'assignment':
            return renderAssignmentContent();
        case 'confirming':
            return renderConfirmContent();
        case 'table':
        default:
            return renderTableContent();
    }
};

    return (
        <div className="dashboard-layout">
            <PrincipalSidebar />
            <main className="main-content">
                <header className="dashboard-header"><h1>Data Management</h1></header>
                <div className="data-table-container">{renderContent()}</div>
                {mode === 'table' && !isLoading && (
                    <div className="import-button-container">
                        <button className="import-button" onClick={() => setMode('uploading')}>Import new file</button>
                    </div>
                )}
            </main>

            {mode === 'uploading' && (
                <div className="modal-overlay" onClick={() => setMode('table')}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            {isDragActive ? <p>Drop the file here...</p> : <p>Browse Files to upload</p>}
                        </div>
                        {fileToUpload && (
                            <div className="selected-file">
                                Selected file: {fileToUpload.name}
                            </div>
                        )}
                        <button className="cancel-button" onClick={() => setMode('table')}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataManagementPage;