import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            Career Gateway
          </Link>

          <button className="menu-toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
            {user && (
              <>
                <Link to="/assessments" className="nav-link" onClick={closeMenu}>Assessments</Link>
                <Link to="/career-explorer" className="nav-link" onClick={closeMenu}>Career Explorer</Link>
                <Link to="/results" className="nav-link" onClick={closeMenu}>Results</Link>
              </>
            )}
            <Link to="/resources" className="nav-link" onClick={closeMenu}>Resources</Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>Admin Panel</Link>
            )}
            
            <div className="navbar-actions">
              {user ? (
                <>
                  <span className="user-name">Hi, {user.name}</span>
                  <button className="btn btn-signout" onClick={handleSignOut}>Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="btn btn-signin" onClick={closeMenu}>Sign In</Link>
                  <Link to="/admin-signin" className="btn btn-admin" onClick={closeMenu}>Admin Sign In</Link>
                  <Link to="/signup" className="btn btn-signup" onClick={closeMenu}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;