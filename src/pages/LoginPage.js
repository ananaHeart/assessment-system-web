import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // <-- Import for decoding the token
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // <-- Import for the icons
import './LoginPage.css';
import logo from '../assets/system-logo.png'; 

const LoginPage = () => {
    // State for the form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State for UI control
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            const token = response.data.jwt;
            localStorage.setItem('jwtToken', token);
            
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.authorities && decodedToken.authorities[0];
            
            console.log('User role from JWT:', userRole); 

            if (userRole === 'ROLE_TEACHER') {
                navigate('/teacher/dashboard');
            } else if (userRole === 'ROLE_PRINCIPAL') {
                navigate('/principal/dashboard');
            } else {
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
            <header className="login-header">
                <span className="title">Teacher Login</span>
                <div className="activate-link">
                    Need to Activate account? <Link to="/activate">Activate here</Link>
                </div>
            </header>

            <div className="login-card">
                <img src={logo} alt="System Logo" style={{ width: '80px', marginBottom: '15px' }} />
                <h2>Automated Assessment System</h2>
                <p className="subtitle">Sign in to access your account</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    
                    <div className="form-group password-input-wrapper">
                        <input 
                            type={isPasswordVisible ? "text" : "password"} 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    
                    <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                    
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    
                    <button type="submit" className="btn btn-secondary">Login</button>
                </form>

                <p className="copyright">© 2025 Automated Assessment System</p>
            </div>
        </div>
    );
};

export default LoginPage;