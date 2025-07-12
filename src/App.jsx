import React, { useState } from 'react'
import Hero from './pages/Hero'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

const App = () => {
  const [currentPage, setCurrentPage] = useState('hero')

  const handleNavigateToLogin = () => {
    setCurrentPage('login')
  }

  const handleNavigateToSignUp = () => {
    setCurrentPage('signup')
  }

  const handleBackToHome = () => {
    setCurrentPage('hero')
  }

  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', height: '100vh' }}>
      {currentPage === 'hero' ? (
        <Hero 
          onNavigateToLogin={handleNavigateToLogin} 
          onNavigateToSignUp={handleNavigateToSignUp} 
        />
      ) : currentPage === 'login' ? (
        <Login onBackToHome={handleBackToHome} />
      ) : (
        <SignUp onBackToHome={handleBackToHome} />
      )}
    </div>
  )
}

export default App