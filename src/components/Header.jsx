import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Bike, Car, Menu, User, X } from 'lucide-react'; 
import AuthModal from './AuthModal';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userAuth, setUserAuth] = useState(() => {
    const saved = localStorage.getItem('vahan_user_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const handleAuthSuccess = (data) => {
    setUserAuth(data);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('vahan_user_auth');
    setUserAuth(null);
  };
  
  return (
    <>
      <header className="header">
        <div className="container header-container">
          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="logo-text">vahan.rentals</span>
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
            {userAuth ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary-color)' }}>
                  👤 {userAuth.identifier}
                </span>
                <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="btn btn-outline login-btn" onClick={() => setIsAuthOpen(true)}>
                <span className="login-text">Login/Sign Up</span>
                <User className="login-icon" size={20} />
              </button>
            )}
          </div>
        </div>
      </header>
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </>
  );
};

export default Header;
