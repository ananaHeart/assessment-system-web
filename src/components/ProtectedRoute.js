import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    // Fix: Handle different token structures
    const userRole = decodedToken.role || decodedToken.authorities?.[0]?.authority;
    
    if (!userRole) {
      return <Navigate to="/login" replace />;
    }

    return userRole === allowedRole 
      ? <Outlet /> 
      : <Navigate to="/unauthorized" replace />;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem('jwtToken');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;