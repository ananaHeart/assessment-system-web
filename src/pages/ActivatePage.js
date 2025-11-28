import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // We only need useNavigate
import './ActivatePage.css';

const ActivatePage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ email: '', firstName: '', lastName: '', dateOfBirth: '', gender: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleVerifyEmail = async () => {
        if (!formData.email) { setError('Please enter an email address.'); return; }
        setError('');
        try {
            await axios.post('http://localhost:8080/api/auth/verify', { email: formData.email });
            nextStep();
        } catch (err) {
            setError(err.response?.data?.message || 'This email is not valid for activation.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
        try {
            await axios.post('http://localhost:8080/api/auth/activate', formData);
            alert('Account activated successfully! You can now log in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Activation failed. Please check your details.');
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const ProgressBar = () => <div className="progress-bar"><div className="progress-bar-inner" style={{ width: `${(step / 3) * 100}%` }}></div></div>;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h2>Activate Your Account</h2>
                        <p className="subtitle" style={{marginBottom: '20px'}}>Please enter the email address provided by your administrator.</p>
                        <div className="form-group"><input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /></div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button onClick={handleVerifyEmail} className="btn btn-secondary">Next</button>
                    </>
                );
            case 2:
                return (
                    <>
                        <h2>Basic Details</h2>
                        <p className="subtitle" style={{marginBottom: '20px'}}>Please enter your personal information.</p>
                        <div className="form-group"><input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required /></div>
                        <div className="form-group"><input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required /></div>
                        <div className="form-group"><input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required /></div>
                        <div className="form-group">
                            <select name="gender" value={formData.gender} onChange={handleChange} required className="form-group input">
                                <option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={prevStep} className="btn btn-back">Back</button>
                            <button onClick={nextStep} className="btn btn-secondary">Next</button>
                        </div>
                    </>
                );
            case 3:
                return (
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <h2>Create Password</h2>
                        <p className="subtitle" style={{marginBottom: '20px'}}>Choose a secure password.</p>
                        <div className="form-group"><input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /></div>
                        <div className="form-group"><input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required /></div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={prevStep} type="button" className="btn btn-back">Back</button>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </form>
                );
            default: return null;
        }
    };

    return (
        <div className="activate-page-wrapper">
            <div className="login-card">
                <ProgressBar />
                {renderStep()}
            </div>
        </div>
    );
};

export default ActivatePage;