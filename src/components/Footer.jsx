import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        
        <div className="footer-brand">
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>
            <img src="/vahan-rentals-logo.png" alt="Vahan.Rentals Logo" className="footer-logo-img" />
          </Link>
          <p className="footer-desc">
            The largest fleet of vehicles in Rishikesh and Dehradun. 
            Get the perfect ride for your mountain getaway with premium service and well-maintained vehicles.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">f</a>
            <a href="#" className="social-link">t</a>
            <a href="#" className="social-link">in</a>
          </div>
        </div>
        
        <div className="footer-nav-row">
          <div className="footer-links-group">
            <h4 className="footer-title">SUPPORT</h4>
            <Link to="/help-center">Help Center</Link>
            <Link to="/terms-and-conditions">Terms & Conditions</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/cancellation-policy">Cancellation</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-title">COMPANY</h4>
            <Link to="/about-us">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/partner/login" className="footer-partner-link">Partner Portal</Link>
          </div>
        </div>
        
        <div className="footer-contact">
          <h4 className="footer-title">CONTACT US</h4>
          <p>+91 70605 12661</p>
          <p>info@vahan.rentals</p>
          <p>Rishikesh, Uttarakhand</p>

          <Link to="/partner/login" className="partner-login-btn">
            <ShieldCheck size={16} /> Partner Login
          </Link>
        </div>
        
      </div>
      <div className="footer-bottom container">
        <p>© 2026 <Link to="/" style={{ color: 'var(--primary-color, #ff7a00)', textDecoration: 'none', fontWeight: '600' }}>vahan.rentals</Link>. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
