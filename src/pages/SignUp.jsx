import React, { useState } from 'react';
import axios from 'axios';

const SignUp = ({ onBackToHome }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user types
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Make API call to register user
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.status === 'success') {
        setMessage('Account created successfully! You can now login.');
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          onBackToHome();
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        setError(errorMessages);
      } else if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection.');
      } else {
        setError(`Error: ${error.message || 'Something went wrong. Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Back Button */}
      <button className="signup-back-btn" onClick={onBackToHome}>
        ←
      </button>

      {/* Main Content */}
      <div className="signup-content">
        <h1 className="signup-title">
          Welcome to<br />
          SwapSkills
        </h1>
        
        <p className="signup-subtitle">
          Create your account and start your journey of skill exchange and growth
        </p>

        {/* Success/Error Messages */}
        {message && (
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#22c55e',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* SignUp Form */}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="signup-input"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="signup-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="signup-input"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="signup-input"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="signup-divider">
          <span className="signup-divider-text">Or sign up with</span>
        </div>

        {/* Social SignUp */}
        <div className="signup-social">
          <button className="signup-social-btn" title="Google">
            G
          </button>
          <button className="signup-social-btn" title="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </button>
          <button className="signup-social-btn" title="LinkedIn">
            in
          </button>
        </div>

        {/* Toggle to Login */}
        <div className="signup-toggle">
          Already have an account? 
          <span className="signup-toggle-link" onClick={onBackToHome}>
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
