import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../ui/Button.jsx';

function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    // TODO: Implement profile update API call
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  return (
    <div className="page">
      <h2 className="page-title">Profile Settings</h2>

      <div className="profile-page-container">
        <div className="profile-section">
          <div className="profile-avatar-section">
            <div className="profile-avatar-xl">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3 className="profile-name">{user?.username || 'User'}</h3>
            <p className="profile-role">Portfolio Manager</p>
          </div>

          <div className="profile-details">
            <h3 className="section-title">Account Information</h3>
            
            <div className="form-group">
              <label className="form-label">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              ) : (
                <p className="form-value">{user?.username || 'N/A'}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              ) : (
                <p className="form-value">{user?.email || 'Not set'}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Account Created</label>
              <p className="form-value">
                {new Date().toLocaleDateString('en-IN')}
              </p>
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3 className="section-title">Security</h3>
          <div className="form-group">
            <label className="form-label">Password</label>
            <Button variant="secondary" size="small">
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;