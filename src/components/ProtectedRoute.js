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
    
    // Extract and normalize role (remove "ROLE_" prefix and convert to lowercase)
    const rawRoles = decodedToken.roles || [];
    const rolesArray = Array.isArray(rawRoles) ? rawRoles : [rawRoles];
    const userRole = rolesArray[0]?.replace('ROLE_', '').toLowerCase();
    
    // Normalize allowedRole for comparison
    const normalizedAllowedRole = allowedRole.toLowerCase();

    if (!userRole) {
      localStorage.removeItem('jwtToken');
      return <Navigate to="/login" replace />;
    }

    return userRole === normalizedAllowedRole 
      ? <Outlet /> 
      : <Navigate to="/unauthorized" replace />;
      
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem('jwtToken');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;