import React from 'react';
import Sidebar from '../components/layout/PrincipalDashboard/Sidebar';
import StatCard from '../components/dashboard/StatCard';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import 'react-circular-progressbar/dist/styles.css';

const PrincipalDashboardPage = () => {
    // Mock data that matches your Principal "after" design
    const mockData = {
        principalName: "Ms. Principal",
        activeTeachers: 3,
        totalStudents: 96,
        performance: {
            rate: 100,
            teacherName: "Ana Dela Cruz",
            subject: "English",
            grade: 10,
            section: "Rizal"
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar/>
            <main className="main-content">
                <header className="dashboard-header">
                    <h1>Dashboard</h1>
                </header>
                <div className="welcome-banner">
                    <h2>WELCOME, {mockData.principalName.toUpperCase()}!</h2>
                </div>
                <div className="stats-container">
                    <StatCard title="Active Teachers" value={mockData.activeTeachers} />
                    <StatCard title="Total Students" value={mockData.totalStudents} />
                </div>
                <div className="performance-container">
                    <h3>Performance Details</h3>
                    <div className="performance-card principal-performance-card">
                        <PerformanceChart 
                            value={mockData.performance.rate} 
                            text={`${mockData.performance.rate}%`} 
                        />
                        <div className="performance-text principal-performance-text">
                            <h4>Highest passing rate</h4>
                            <p><strong>Teacher:</strong> {mockData.performance.teacherName}</p>
                            <p><strong>Subject:</strong> {mockData.performance.subject}</p>
                            <p><strong>Grade:</strong> {mockData.performance.grade}</p>
                            <p><strong>Section:</strong> {mockData.performance.section}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrincipalDashboardPage;