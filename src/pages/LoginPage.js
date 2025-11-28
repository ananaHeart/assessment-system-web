import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css';
import logo from '../assets/system-logo.png'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
        const response = await api.auth.login({ email, password });
        const token = response.data.jwt;
        localStorage.setItem('jwtToken', token);
        
        const decodedToken = jwtDecode(token);
        console.log('DECODED TOKEN STRUCTURE:', decodedToken);

        // FIX: Extract and normalize role (remove "ROLE_" prefix)
        const rawRole = decodedToken.roles?.[0] || '';
        const userRole = rawRole.replace('ROLE_', '').toLowerCase();
        
        if (userRole === 'teacher') {
            navigate('/teacher/dashboard');
        } else if (userRole === 'principal') {
            navigate('/principal/dashboard');
        } else {
            console.error("Unknown or missing role:", userRole);
            navigate('/unauthorized');
        }
    } catch (err) {
        setError('Login failed. Please check your credentials.');
        console.error(err);
    }
};

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                <img src={logo} alt="System Logo" style={{ width: '80px', marginBottom: '15px' }} />
                <h2>Automated Assessment System</h2>
                <p className="subtitle">Sign in to access your account</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    
                    <div className="form-group password-input-wrapper">
                        <input type={isPasswordVisible ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    
                    <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <button type="submit" className="btn btn-secondary">Login</button>
                </form>

                <div className="activate-link" style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center' }}>
                    Need to activate your account? <Link to="/activate">Activate here</Link>
                </div>

                <p className="copyright">© 2025 Automated Assessment System</p>
            </div>
        </div>
    );
};

export default LoginPage;