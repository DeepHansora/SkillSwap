import React, { useState } from 'react';

const Brief = () => {
  const [activeTab, setActiveTab] = useState('All Skills');

  // Demo skill data with dynamic imageSrc
  const demoSkills = [
    {
      name: "React Development",
      category: "Programming",
      imageSrc: "src/assets/LktghhB3F7Z7uktlm5ttkbVXogE.svg",
      providers: [
        {
          name: "Sarah Chen",
          level: "Advanced",
          location: "San Francisco, CA",
          availability: "Weekends"
        },
        {
          name: "Mike Johnson",
          level: "Expert",
          location: "New York, NY",
          availability: "Evenings"
        }
      ]
    },
    {
      name: "Digital Marketing",
      category: "Business",
      imageSrc: "src/assets/uEpJGJLIkSHeJLNyzVayfiOdZ9U.svg",
      providers: [
        {
          name: "Emma Rodriguez",
          level: "Intermediate",
          location: "Austin, TX",
          availability: "Flexible"
        }
      ]
    },
    {
      name: "Guitar Lessons",
      category: "Music",
      imageSrc: "src/assets/ujjVjiL7DhGglIg7PRfF5EEa0k.svg",
      providers: [
        {
          name: "Alex Thompson",
          level: "Advanced",
          location: "Nashville, TN",
          availability: "Weekdays"
        },
        {
          name: "Luna Martinez",
          level: "Expert",
          location: "Los Angeles, CA",
          availability: "Weekends"
        },
        {
          name: "David Kim",
          level: "Intermediate",
          location: "Seattle, WA",
          availability: "Evenings"
        }
      ]
    },
    {
      name: "Photoshop Design",
      category: "Design",
      imageSrc: "/assets/photoshop-illustration.svg",
      providers: [
        {
          name: "Jessica Park",
          level: "Advanced",
          location: "Portland, OR",
          availability: "Flexible"
        }
      ]
    },
    {
      name: "Python Programming",
      category: "Programming",
      imageSrc: "/assets/python-illustration.svg",
      providers: [
        {
          name: "Carlos Santos",
          level: "Expert",
          location: "Miami, FL",
          availability: "Weekdays"
        },
        {
          name: "Aisha Patel",
          level: "Advanced",
          location: "Boston, MA",
          availability: "Evenings"
        }
      ]
    },
    {
      name: "Spanish Tutoring",
      category: "Language",
      imageSrc: "/assets/spanish-illustration.svg",
      providers: [
        {
          name: "Maria Gonzalez",
          level: "Expert",
          location: "Phoenix, AZ",
          availability: "Flexible"
        }
      ]
    }
  ];

  const skillCategories = ['All Skills', 'Programming', 'Business', 'Music', 'Design', 'Language'];

  const filteredSkills = activeTab === 'All Skills' 
    ? demoSkills 
    : demoSkills.filter(skill => skill.category === activeTab);

  const getSkillIcon = (category) => {
    const icons = {
      'Technology': '💻',
      'Programming': '⚡',
      'Design': '🎨',
      'Language': '🗣️',
      'Business': '💼',
      'Arts': '🎭',
      'Music': '🎵',
      'Sports': '⚽',
      'Cooking': '👨‍🍳',
      'Health': '🏥',
      'Education': '📚',
      'General': '🎯'
    };
    return icons[category] || '🎯';
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': '#4ade80',
      'Intermediate': '#fbbf24',
      'Advanced': '#f87171',
      'Expert': '#8b5cf6'
    };
    return colors[level] || '#6b7280';
  };

  return (
    <div className="brief-container">
      <div className="brief-content">
        {/* Header Section */}
        <div className="brief-header">
          <div className="brief-badge">
            Skills Available
          </div>
          <h1 className="brief-title">
            Discover<br />
            Skill Offerings
          </h1>
          
          {/* Navigation Tabs */}
          <div className="brief-nav">
            {skillCategories.map(category => (
              <button 
                key={category}
                className={`nav-tab ${activeTab === category ? 'active' : ''}`}
                onClick={() => setActiveTab(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="course-grid">
          {filteredSkills.length > 0 ? (
            filteredSkills.slice(0, 3).map((skill, index) => (
              <div key={`${skill.name}-${index}`} className="course-card">
                <div className="course-header">
                  <span className="course-badge">{skill.category}</span>
                  <span className="save-badge">{skill.providers.length} Provider{skill.providers.length > 1 ? 's' : ''}</span>
                </div>
                <h3 className="course-title">{skill.name}</h3>
                
                {/* Providers List */}
                <div className="skill-providers">
                  {skill.providers.slice(0, 2).map((provider, idx) => (
                    <div key={idx} className="provider-item">
                      <div className="provider-info">
                        <span className="provider-name">{provider.name}</span>
                        <span 
                          className="provider-level"
                          style={{ color: getLevelColor(provider.level) }}
                        >
                          {provider.level}
                        </span>
                      </div>
                      <div className="provider-location">{provider.location}</div>
                    </div>
                  ))}
                  {skill.providers.length > 2 && (
                    <div className="more-providers">
                      +{skill.providers.length - 2} more
                    </div>
                  )}
                </div>

                <div className="course-actions">
                  <button className="enroll-btn">Contact Provider</button>
                  <button className="learn-more-btn">View Details</button>
                </div>
                
                <div className="course-stats">
                  <div className="stat">
                    <div className="stat-icon">{getSkillIcon(skill.category)}</div>
                    <span>{skill.category}</span>
                  </div>
                  <div className="stat">
                    <div className="stat-icon">👥</div>
                    <span>{skill.providers.length} available</span>
                  </div>
                  <div className="stat">
                    <div className="stat-icon">📍</div>
                    <span>Various locations</span>
                  </div>
                </div>
                
                <div className="course-illustration">
                  <div className="illustration-placeholder">
                    <div className="illustration-elements">
                      <img className="illustrator-pic" src={skill.imageSrc} alt={skill.name} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-skills">
              <div className="no-skills-icon">🎯</div>
              <h3>No skills available in this category</h3>
              <p>Check back later or try a different category</p>
            </div>
          )}
        </div>

        {/* Show More Button */}
        {filteredSkills.length > 3 && (
          <div className="view-all-section">
            <button className="view-all-btn" onClick={() => console.log('Navigate to skills page')}>
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brief;
