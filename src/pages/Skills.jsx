import React, { useState, useEffect } from 'react';

const Skills = ({ onBackToHome }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSkills, setFilteredSkills] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    // Filter skills based on search term
    if (searchTerm.trim() === '') {
      setFilteredSkills(skills);
    } else {
      const filtered = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSkills(filtered);
    }
  }, [searchTerm, skills]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/skills');
      
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }

      const data = await response.json();
      setSkills(data);
      setFilteredSkills(data);
    } catch (err) {
      setError('Failed to load skills. Please try again later.');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupSkillsByCategory = (skillsList) => {
    return skillsList.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return '#4ade80'; // green
      case 'intermediate':
        return '#fbbf24'; // yellow
      case 'advanced':
        return '#f87171'; // red
      case 'expert':
        return '#a78bfa'; // purple
      default:
        return '#64748b'; // gray
    }
  };

  const handleContactUser = (userEmail, skillName) => {
    const subject = `Interested in ${skillName} skill exchange`;
    const body = `Hi! I saw your ${skillName} skill on SwapSkills and I'm interested in connecting. Let's discuss a potential skill exchange!`;
    const mailtoLink = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  if (loading) {
    return (
      <div className="skills-container">
        <div className="skills-header">
          <button onClick={onBackToHome} className="back-button">← Back to Home</button>
          <h1>All Skills</h1>
        </div>
        <div className="loading-message">Loading skills...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="skills-container">
        <div className="skills-header">
          <button onClick={onBackToHome} className="back-button">← Back to Home</button>
          <h1>All Skills</h1>
        </div>
        <div className="error-message">{error}</div>
        <button onClick={fetchSkills} className="retry-button">Try Again</button>
      </div>
    );
  }

  const groupedSkills = groupSkillsByCategory(filteredSkills);

  return (
    <div className="skills-container">
      <div className="skills-header">
        <button onClick={onBackToHome} className="back-button">← Back to Home</button>
        <h1>All Skills</h1>
        <p className="skills-subtitle">Discover skills offered by our community</p>
      </div>

      <div className="skills-search">
        <input
          type="text"
          placeholder="Search skills, categories, or users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="skills-stats">
        <span className="stats-item">Total Skills: {filteredSkills.length}</span>
        <span className="stats-item">Categories: {Object.keys(groupedSkills).length}</span>
        <span className="stats-item">Active Users: {new Set(filteredSkills.map(s => s.userId)).size}</span>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="no-skills">
          <h3>No skills found</h3>
          <p>Try adjusting your search or check back later!</p>
        </div>
      ) : (
        <div className="skills-grid">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="skills-list">
                {categorySkills.map((skill) => (
                  <div key={`${skill.userId}-${skill.name}`} className="skill-card">
                    <div className="skill-header">
                      <h3 className="skill-name">{skill.name}</h3>
                      <span 
                        className="skill-level"
                        style={{ backgroundColor: getLevelColor(skill.level) }}
                      >
                        {skill.level || 'Intermediate'}
                      </span>
                    </div>
                    <div className="skill-user">
                      <span className="user-name">by {skill.userName}</span>
                      {skill.userLocation && (
                        <span className="user-location">📍 {skill.userLocation}</span>
                      )}
                    </div>
                    {skill.description && (
                      <p className="skill-description">{skill.description}</p>
                    )}
                    <button 
                      onClick={() => handleContactUser(skill.userEmail, skill.name)}
                      className="contact-button"
                    >
                      Contact for Exchange
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Skills;
