import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/TeacherDashboard/Sidebar';
import StatCard from '../components/dashboard/StatCard';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import 'react-circular-progressbar/dist/styles.css';      // <-- The library's CSS

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [error] = useState(''); // <-- We only need 'error' for now

    useEffect(() => {
        const fetchDashboardData = () => {
            setTimeout(() => {
                const mockData = {
                    teacherFirstName: "Ana",
                    activeClasses: 1,
                    totalAssessments: 1, // Let's use your "after" design data
                    totalStudents: 32,
                    performance: { // Add mock data for the chart
                        value: 100,
                        title: "English Quiz 1",
                        details: "Grade 10 Rizal get 100% passing rate"
                    }
                };
                setDashboardData(mockData);
            }, 1000);
        };
        fetchDashboardData();
    }, []);

    if (error) { return <p style={{ color: 'red' }}>{error}</p>; }
    if (!dashboardData) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="main-content">
                    <p>Loading dashboard...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="dashboard-header"><h1>Dashboard</h1></header>
                <div className="welcome-banner">
                    <h2>WELCOME, TEACHER {dashboardData.teacherFirstName.toUpperCase()}!</h2>
                    <p>Start managing your students score !</p>
                </div>
                <div className="stats-container">
                    <StatCard title="Active Classes" value={dashboardData.activeClasses} />
                    <StatCard title="Total Assessment" value={dashboardData.totalAssessments} />
                    <StatCard title="Students" value={dashboardData.totalStudents} />
                </div>

                {/* --- THIS IS THE UPDATED SECTION --- */}
                <div className="performance-container">
                    <h3>Performance Details</h3>
                    <div className="performance-card">
                        {/* 2. Use the new component with data from our mock state */}
                        <PerformanceChart 
                            value={dashboardData.performance.value} 
                            text={`${dashboardData.performance.value}%`} 
                        />
                        <div className="performance-text">
                            <h4>{dashboardData.performance.title}</h4>
                            <p>{dashboardData.performance.details}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;