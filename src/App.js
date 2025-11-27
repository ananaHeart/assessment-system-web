import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrincipalDashboardPage from './pages/PrincipalDashboardPage';
import ActivatePage from './pages/ActivatePage';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';
import DataManagementPage from './pages/DataManagementPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/activate" element={<ActivatePage />} />

      <Route element={<ProtectedRoute allowedRole="ROLE_TEACHER" />}>

        <Route path="/teacher/dashboard" element={<DashboardPage />} />
        <Route path="/teacher/data-management" element={<DataManagementPage />} />
      </Route>
      
      {/* Principal Protected Routes */}
      <Route element={<ProtectedRoute allowedRole="ROLE_PRINCIPAL" />}> 

        <Route path="/principal/dashboard" element={<PrincipalDashboardPage />} />
      </Route>
      
    </Routes>
  );
}

export default App;