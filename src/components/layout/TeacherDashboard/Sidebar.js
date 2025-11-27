import React from 'react';
const Sidebar = () => (
    <div className="sidebar">
        <div className="sidebar-header"><h3>Automated Assessment System</h3></div>
        <ul className="sidebar-menu">
            <li className="active">Dashboard</li>
            <li>Assessment</li>
            <li>Classes</li>
        </ul>
        <div className="sidebar-footer"><p>Profile Settings</p><p>Logout</p></div>
    </div>
);
export default Sidebar;