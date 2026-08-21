import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Bike, Car, Menu, User, X, Volume2, Clock } from 'lucide-react'; 
import AuthModal from './AuthModal';
import UserProfileModal from './UserProfileModal';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [fontSizeLevel, setFontSizeLevel] = useState('normal');

  const [userAuth, setUserAuth] = useState(() => {
    const saved = localStorage.getItem('vahan_user_auth');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentDateTime(`${day}-${month}-${year} | ${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFontSizeChange = (level) => {
    setFontSizeLevel(level);
    if (level === 'small') {
      document.documentElement.style.fontSize = '14px';
    } else if (level === 'normal') {
      document.documentElement.style.fontSize = '16px';
    } else if (level === 'large') {
      document.documentElement.style.fontSize = '18px';
    }
  };

  const handleAuthSuccess = (data) => {
    setUserAuth(data);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('vahan_user_auth');
    setUserAuth(null);
    setIsProfileOpen(false);
  };
  
  return (
    <>
      {/* Top Announcement & Live Time Bar */}
      <div className="top-announcement-bar">
        <div className="container top-bar-container">
          <div className="top-bar-left">
            <span className="announcement-badge">
              <Volume2 size={11} />
            </span>
            <div className="ticker-text">
              <strong>Travel Advisory:</strong> Passengers & renters are advised to check vehicle condition, platform details & helmet rules before trip commencement.
            </div>
          </div>

          <div className="top-bar-right">
            <span className="live-clock">
              <Clock size={11} style={{ marginRight: 4, verticalAlign: '-1px' }} />
              {currentDateTime}
            </span>
            <div className="font-controls">
              <button 
                className={`font-btn ${fontSizeLevel === 'small' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('small')}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button 
                className={`font-btn ${fontSizeLevel === 'normal' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('normal')}
                title="Default Font Size"
              >
                A
              </button>
              <button 
                className={`font-btn ${fontSizeLevel === 'large' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('large')}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container header-container">
          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/vahan-rentals-logo.png" alt="Vahan.Rentals Logo" className="brand-logo-img" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
          </Link>
          
          {/* Category Navigation */}
          <div className={`category-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/" className={`cat-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <Compass className="cat-icon" size={20} />
              <span className="cat-text">EXPLORE</span>
            </Link>
            
            <Link to="/bikes" className={`cat-link ${location.pathname === '/bikes' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <Bike className="cat-icon" size={20} />
              <span className="cat-text">BIKES</span>
            </Link>
            
            <Link to="/cars" className={`cat-link ${location.pathname === '/cars' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <Car className="cat-icon" size={20} />
              <span className="cat-text">CARS/TAXI SERVICE</span>
            </Link>
          </div>

          <div className="header-actions">
            {userAuth ? (() => {
              const rawName = userAuth.name || (userAuth.email ? userAuth.email.split('@')[0] : (userAuth.identifier ? userAuth.identifier.split('@')[0] : 'Rider'));
              const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
              return (
                <button 
                  className="user-profile-pill" 
                  onClick={() => setIsProfileOpen(true)}
                  title="Open My Profile & Bookings"
                >
                  <div className="user-pill-avatar">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-pill-text">{displayName}</span>
                </button>
              );
            })() : (
              <button className="btn btn-outline login-btn" onClick={() => setIsAuthOpen(true)}>
                <span className="login-text">Login/Sign Up</span>
                <User className="login-icon" size={20} />
              </button>
            )}
          </div>
        </div>
      </header>
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} />
      
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        userAuth={userAuth}
        onLogout={handleLogout}
        onProfileUpdate={(updatedData) => setUserAuth(updatedData)}
      />
    </>
  );
};

export default Header;
