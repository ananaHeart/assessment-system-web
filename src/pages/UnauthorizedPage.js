import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>403 - Access Denied</h1>
            <p>You do not have the necessary permissions to view this page.</p>
            <Link to="/login">Return to Login</Link>
        </div>
    );
};

export default UnauthorizedPage;