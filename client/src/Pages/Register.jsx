import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
        keepDetails: false
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    
        if (!passwordRegex.test(formData.password)) {
            setError('Password must be at least 8 characters long and contain both uppercase and lowercase letters.');
            return;
        }
    
        if (!formData.agreeToTerms) {
            setError('You must accept the terms and conditions.');
            return;
        }
    
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
    
        try {
            const response = await fetch('http://127.0.0.1:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: formData.fullName, 
                    email: formData.email,
                    password: formData.password,
                }),
            });
    
            const data = await response.json(); 
    
            if (response.ok) {
                alert('Registration successful!');
                navigate('/login');
            } else {
                setError(data.detail || 'Registration failed.');
                alert(`Error: ${data.detail || 'Registration failed.'}`);
            }
        } catch (error) {
            setError('Error registering user. Please try again.');
            alert(`Error: ${error.message}`);
        }
    };
    

    return (
        <div className="register-container">
            <h2>Registeration Page</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name here"
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email here"
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password here"
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password here"
                        required
                    />
                </div>
                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="keepDetails"
                            checked={formData.keepDetails}
                            onChange={handleChange}
                        />
                        Remember Me
                    </label>
                </div>
                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                        />
                        I accept terms and conditions
                    </label>
                </div>
                <button type="submit" className="register-button">Create my Account!</button>
                {error && <p className="error-message">{error}</p>}
                <p className="login-link">
                    Already have one? <a href="/login">Login here!</a>
                </p>
            </form>
        </div>
    );
};

export default Register;
