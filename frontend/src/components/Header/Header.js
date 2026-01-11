import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaShieldAlt } from 'react-icons/fa';
import './Header.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Header() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      setUser(null);
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="shield-icon"><FaShieldAlt /></div>
          <span className="logo-text">BrandShield</span>
        </Link>
        
        <nav className="nav-links">
        </nav>
        
        <Link to="/dashboard" className="cta-button" style={{ textDecoration: 'none' }}>Start Analysis</Link>
      </div>
    </header>
  );
}

export default Header;
