import React, { useState } from 'react';

const Login = ({ onBackToHome, onNavigateToSignUp }) => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login form submitted:', formData);
  };

  return (
    <div className="login-container">
      {/* Back Button */}
      <button className="login-back-btn" onClick={onBackToHome}>
        ←
      </button>

      {/* Main Content */}
      <div className="login-content">
        <h1 className="login-title">
          Hey there,<br />
          Skill-Swapper!
        </h1>
        
        <p className="login-subtitle">
          Sign in to explore, share and grow together
        </p>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="login-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-input"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        {/* Create Account Button */}
        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
          <button
            className="login-button"
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#fff",
              fontSize: "14px",
              padding: "10px 20px",
              fontWeight: "500"
            }}
            onClick={onNavigateToSignUp}
 // You can change this to `onNavigateToSignUp` if available
          >
            Create an Account
          </button>
        </div>


        {/* Divider */}
        <div className="login-divider">
          <span className="login-divider-text">Or continue with</span>
        </div>

        {/* Social Login */}
        <div className="login-social">
          <button className="login-social-btn" title="Google">
            G
          </button>
          <button className="login-social-btn" title="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </button>
          <button className="login-social-btn" title="LinkedIn">
            in
          </button>
        </div>

        {/* Toggle to SignUp */}
        <div className="login-toggle">
          Don't have an account? 
          <span className="login-toggle-link" onClick={onBackToHome}>
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
