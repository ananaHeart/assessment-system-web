import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ActivatePage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // To track which step we are on

    // State to hold all the form data
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    // A helper function to update our form data state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // This function runs when the final "Save" button is clicked
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/auth/activate', {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth
            });

            alert('Account activated successfully! You can now log in.');
            navigate('/login'); // Redirect to login page on success

        } catch (err) {
            setError('Activation failed. Please check your details or contact an administrator.');
            console.error(err);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    // --- Conditional Rendering for Each Step ---

    if (step === 1) {
        return (
            <div className="login-container" style={{ margin: 'auto' }}>
                <h2>Activate Your Account</h2>
                <p>Please enter the email address provided by your administrator.</p>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <button onClick={nextStep}>Next</button>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="login-container" style={{ margin: 'auto' }}>
                <h2>Basic Details</h2>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <button onClick={prevStep} style={{ marginRight: '10px', backgroundColor: '#6c757d' }}>Back</button>
                <button onClick={nextStep}>Next</button>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="login-container" style={{ margin: 'auto' }}>
                <h2>Create Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button onClick={prevStep} type="button" style={{ marginRight: '10px', backgroundColor: '#6c757d' }}>Back</button>
                    <button type="submit">Save</button>
                </form>
            </div>
        );
    }
};

export default ActivatePage;