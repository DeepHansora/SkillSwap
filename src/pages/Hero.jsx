import React from 'react';
import HeroImg from "../assets/Hero.png";
import Avatar1 from "../assets/p1.jpg";
import Avatar2 from "../assets/p2.jpg";
import Avatar3 from "../assets/p3.jpg";
import Avatar4 from "../assets/p4.jpg";

const Hero = ({ onNavigateToLogin, onNavigateToSignUp }) => {
  const avatars = [Avatar1, Avatar2, Avatar3, Avatar4];

  return (
    <div 
      className="hero-container"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      {/* Header Navigation */}
      <div className="hero-header">
        <div className="hero-logo">
          SWAPSKILLS
        </div>
        <div className="hero-auth-buttons">
          <button className="hero-btn hero-btn--signup" onClick={onNavigateToSignUp}>
            Sign Up
          </button>
          <button className="hero-btn hero-btn--login" onClick={onNavigateToLogin}>
            Login
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="hero-content">
        {/* Course Announcement */}
        <div className="hero-announcement">
          🎯 Introducing new course: Skill Exchange Platform →
        </div>

        {/* Main Headline */}
        <h1 className="hero-title">
          Learn in demand<br />skills online
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Premium courses from Premium specialists of Top companies.
        </p>

        {/* CTA Button */}
        <button className="hero-cta">
          Explore courses →
        </button>

        {/* Student Avatars and Count */}
        <div className="hero-social-proof">
          <div className="hero-avatars">
            {avatars.map((img, index) => (
              <div key={index} className="hero-avatar">
               <img src={img} alt={`User ${index + 1}`} className="avatar-img" />
              </div>
            ))}

          </div>
          <p className="hero-student-count">
            Over 1500+ students
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator">
        <span>Scroll Down</span>
        <div className="hero-scroll-arrow">↓</div>
      </div>
    </div>
  );
}

export default Hero;
