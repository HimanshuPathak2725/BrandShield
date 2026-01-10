import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
          <div className="shield-icon">🛡️</div>
          <span className="logo-text">BrandShield</span>
        </Link>
        
        <nav className="nav-links">
          <a href="#product" className="nav-link">Product</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#demo" className="nav-link">Demo</a>
          <a href="#about" className="nav-link">About</a>
          
          {!user ? (
            <Link to="/auth" className="nav-link" style={{ textDecoration: 'none' }}>Login/Signup</Link>
          ) : (
            <div className="user-menu" style={{ position: 'relative' }}>
              <button 
                className="nav-link user-button" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
              >
                {user.name || user.email} ▼
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: '#1a1f3a',
                  border: '1px solid #2d3561',
                  borderRadius: '0.5rem',
                  minWidth: '150px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 1000
                }}>
                  <button 
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#2d3561'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
        
        <Link to="/dashboard" className="cta-button" style={{ textDecoration: 'none' }}>Start Analysis</Link>
      </div>
    </header>
  );
}

export default Header;
