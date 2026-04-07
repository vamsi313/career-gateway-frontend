import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../utils/api';
import './Settings.css';

function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiCall(`/users/${user.id}`, { method: 'DELETE' });
      signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to delete account', error);
      alert('Failed to delete account. Please try again.');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1><SettingsIcon size={32} style={{ verticalAlign: 'middle', marginRight: '10px' }}/> Account Settings</h1>
        <p>Manage your account preferences and data</p>
      </div>

      <div className="container">
        <div className="settings-card danger-zone">
          <div className="danger-zone-header">
            <AlertTriangle size={24} color="#dc2626" />
            <h2>Danger Zone</h2>
          </div>
          <p>
            Permanently deleting your account will erase all your assessment history, 
            saved results, and personal data. This action cannot be undone.
          </p>
          
          {!showConfirm ? (
            <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>
              <Trash2 size={16} style={{ marginRight: '8px' }}/> Delete Account
            </button>
          ) : (
            <div className="confirm-delete-box">
              <p><strong>Are you absolutely sure?</strong></p>
              <div className="confirm-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Permanently Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
