import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import ActivatePage from './pages/ActivatePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import PrincipalDashboardPage from './pages/PrincipalDashboardPage';
import DataManagementPage from './pages/DataManagementPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/activate" element={<ActivatePage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Teacher Protected Routes */}
      <Route element={<ProtectedRoute allowedRole="teacher" />}>
        <Route path="/teacher/dashboard" element={<DashboardPage />} />
      </Route>
      
      {/* Principal Protected Routes */}
      <Route element={<ProtectedRoute allowedRole="principal" />}> 
        <Route path="/principal/dashboard" element={<PrincipalDashboardPage />} />
        <Route path="/principal/data-management" element={<DataManagementPage />} />
      </Route>
      
    </Routes>
  );
}

export default App;