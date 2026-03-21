import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './buttons';
import { Avatar } from './avatar';
import '../../css/navbar.css';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path ? 'navbar-link active' : 'navbar-link';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="brand-gradient">JumpStart</span>
        </Link>

        {isDashboard ? (
          <div className="navbar-links">
            <div className="navbar-avatar-area">
              <button
                className="navbar-avatar-btn"
                onClick={() => setDropdownOpen(o => !o)}
              >
                <Avatar name="User" size="sm" />
              </button>
              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Profile
                  </Link>
                  <button
                    className="dropdown-item dropdown-item-danger"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="navbar-links">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/auth/sign-in" className={isActive('/auth/sign-in')}>Sign In</Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.location.href = '/auth/register'}
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
