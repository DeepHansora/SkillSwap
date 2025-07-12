import React, { useState, useEffect } from 'react';

const Profile = ({ onBackToHome, onLogout }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    location: '',
    phone: '',
    occupation: 'student',
    skillsOffered: [],
    skillsWanted: [],
    availability: 'weekends',
    profileType: 'public'
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setProfileData(prev => ({
        ...prev,
        name: userData.name || ''
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkillOffered = () => {
    const skill = newSkillOffered.trim();
    if (skill && !profileData.skillsOffered.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, skill]
      }));
      setNewSkillOffered('');
    }
  };

  const handleRemoveSkillOffered = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s !== skill)
    }));
  };

  const handleAddSkillWanted = () => {
    const skill = newSkillWanted.trim();
    if (skill && !profileData.skillsWanted.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, skill]
      }));
      setNewSkillWanted('');
    }
  };

  const handleRemoveSkillWanted = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(s => s !== skill)
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="profile-container">
      {/* Sidebar Navigation */}
      <div className="profile-sidebar">
        <h2 className="profile-sidebar-title">Account Center</h2>
        <nav className="profile-sidebar-nav">
          <button 
            className={`profile-sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="profile-sidebar-icon">👤</span>
            Personal Details
          </button>
          <button 
            className={`profile-sidebar-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <span className="profile-sidebar-icon">📚</span>
            Enrolled Courses
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="profile-main">
        <div className="profile-header">
          <button className="profile-back-btn" onClick={onBackToHome}>
            ←
          </button>
          <button className="profile-logout-btn" onClick={handleLogout}>
            Logout →
          </button>
        </div>
        
        <div className="profile-content">
          {activeTab === 'profile' && (
            <>
              {/* Profile Header Section */}
              <div className="profile-header-section">
                <div className="profile-user-info">
                  <div className="profile-avatar-large">
                    <img src="https://via.placeholder.com/80x80/8b5cf6/ffffff?text=Profile" alt="Profile" />
                    <button className="profile-avatar-edit">✏️</button>
                  </div>
                  <div className="profile-user-details">
                    <h2 className="profile-username">{profileData.name || 'Dev Tailor'}</h2>
                    <p className="profile-email">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </div>

              {/* Success/Error Messages */}
              {message && (
                <div className="profile-message success">
                  {message}
                </div>
              )}

              {error && (
                <div className="profile-message error">
                  {error}
                </div>
              )}

              {/* Profile Form */}
              <div className="profile-form-container">
                <div className="profile-form-grid">
                  <div className="profile-form-section">
                    <label className="profile-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="profile-input"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="profile-form-section">
                    <label className="profile-label">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="profile-input"
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="profile-form-grid">
                  <div className="profile-form-section">
                    <label className="profile-label">Contact Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your contact number"
                      className="profile-input"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="profile-form-section">
                    <label className="profile-label">Occupation</label>
                    <select
                      name="occupation"
                      value={profileData.occupation || 'student'}
                      onChange={handleInputChange}
                      className="profile-select"
                      disabled={!isEditing}
                    >
                      <option value="student">Student</option>
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="teacher">Teacher</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="profile-form-section">
                  <label className="profile-label">City</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    className="profile-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="profile-form-section">
                  <label className="profile-label">Skills Offered</label>
                  <div className="profile-skills-container">
                    <div className="profile-skills-list">
                      {profileData.skillsOffered.map((skill, index) => (
                        <div key={index} className="profile-skill-tag">
                          {skill}
                          {isEditing && (
                            <button 
                              onClick={() => handleRemoveSkillOffered(skill)}
                              className="profile-skill-remove"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="profile-skill-input-container">
                        <input
                          type="text"
                          value={newSkillOffered}
                          onChange={(e) => setNewSkillOffered(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSkillOffered()}
                          placeholder="Add a skill..."
                          className="profile-skill-input"
                        />
                        <button 
                          onClick={handleAddSkillOffered}
                          className="profile-skill-add-btn"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-form-section">
                  <label className="profile-label">Skills Wanted</label>
                  <div className="profile-skills-container">
                    <div className="profile-skills-list">
                      {profileData.skillsWanted.map((skill, index) => (
                        <div key={index} className="profile-skill-tag wanted">
                          {skill}
                          {isEditing && (
                            <button 
                              onClick={() => handleRemoveSkillWanted(skill)}
                              className="profile-skill-remove"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="profile-skill-input-container">
                        <input
                          type="text"
                          value={newSkillWanted}
                          onChange={(e) => setNewSkillWanted(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSkillWanted()}
                          placeholder="Add a skill you want to learn..."
                          className="profile-skill-input"
                        />
                        <button 
                          onClick={handleAddSkillWanted}
                          className="profile-skill-add-btn"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-form-grid">
                  <div className="profile-form-section">
                    <label className="profile-label">Availability</label>
                    <select
                      name="availability"
                      value={profileData.availability}
                      onChange={handleInputChange}
                      className="profile-select"
                      disabled={!isEditing}
                    >
                      <option value="weekends">Weekends</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="evenings">Evenings</option>
                      <option value="flexible">Flexible</option>
                      <option value="mornings">Mornings</option>
                    </select>
                  </div>

                  <div className="profile-form-section">
                    <label className="profile-label">Profile</label>
                    <select
                      name="profileType"
                      value={profileData.profileType}
                      onChange={handleInputChange}
                      className="profile-select"
                      disabled={!isEditing}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="profile-actions">
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="profile-btn edit"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="profile-edit-actions">
                      <button 
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="profile-btn save"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="profile-btn cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'courses' && (
            <div className="courses-section">
              <h3>Enrolled Courses</h3>
              <div className="courses-placeholder">
                <p>No courses enrolled yet. Start exploring courses to enhance your skills!</p>
                <button className="profile-btn">
                  Browse Courses
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
