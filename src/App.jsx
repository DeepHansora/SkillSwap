import React, { useState, useEffect } from 'react';
import Hero from './pages/Hero';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';

const App = () => {
  const [currentPage, setCurrentPage] = useState('hero');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleNavigateToLogin = () => {
    setCurrentPage('login');
  };

  const handleNavigateToSignUp = () => {
    setCurrentPage('signup');
  };

  const handleNavigateToProfile = () => {
    setCurrentPage('profile');
  };

  const handleBackToHome = () => {
    setCurrentPage('hero');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentPage('hero');
  };

  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', height: '100vh' }}>
      {currentPage === 'hero' ? (
        <Hero 
          onNavigateToLogin={handleNavigateToLogin} 
          onNavigateToSignUp={handleNavigateToSignUp}
          onNavigateToProfile={handleNavigateToProfile}
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
        />
      ) : currentPage === 'login' ? (
        <Login 
          onBackToHome={handleBackToHome} 
          onNavigateToSignUp={handleNavigateToSignUp}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : currentPage === 'signup' ? (
        <SignUp 
          onBackToHome={handleBackToHome}
          onNavigateToLogin={handleNavigateToLogin}
        />
      ) : (
        <Profile 
          onBackToHome={handleBackToHome}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
