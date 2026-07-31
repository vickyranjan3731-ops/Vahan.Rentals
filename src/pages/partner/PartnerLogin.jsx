import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Handshake, Eye, EyeOff, ArrowRight, CheckCircle2, Shield, TrendingUp, KeyRound } from 'lucide-react';
import './PartnerLogin.css';

const PartnerLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [partnerType, setPartnerType] = useState('Bike & Scooty Host');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFillDemo = () => {
    setEmail('partner@vahan.rentals');
    setPassword('partner123');
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both partner email/phone and passcode.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem('vahan_partner_auth', 'true');
      if (onLoginSuccess) {
        onLoginSuccess({ email, partnerType });
      }
      navigate('/partner/dashboard');
    }, 600);
  };

  return (
    <div className="partner-login-wrapper">
      <motion.div 
        className="partner-login-card"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Left Column - Partner Branding & Benefits */}
        <div className="partner-login-left">
          <div className="partner-login-icon-circle">
            <Handshake size={38} />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <Link to="/" className="partner-login-brand-link" style={{ textDecoration: 'none' }}>
              vahan<span>.rentals</span>
            </Link>
          </div>

          <h3>Partner & Host Workspace</h3>
          <p>
            List your vehicles, monitor daily rentals, track revenue payouts, and manage host inventory across Uttarakhand.
          </p>

          <div className="partner-benefits-list">
            <div className="partner-benefit-item">
              <TrendingUp size={16} className="benefit-icon" />
              <span>Earnings up to <strong>₹45,000 / month</strong></span>
            </div>
            <div className="partner-benefit-item">
              <Shield size={16} className="benefit-icon" />
              <span><strong>100% Comprehensive</strong> Damage Insurance</span>
            </div>
            <div className="partner-benefit-item">
              <CheckCircle2 size={16} className="benefit-icon" />
              <span>Real-time GPS Tracking & Payouts</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1.2rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#10b981' }}>
              +91 70605 12661
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              24/7 Partner Host Support Desk
            </div>
          </div>
        </div>

        {/* Right Column - Partner Login Form */}
        <div className="partner-login-right">
          <div className="partner-login-subtitle">
            <Handshake size={14} /> FLEET PARTNER & VEHICLE HOST PORTAL
          </div>
          <h2>Partner & Host Login</h2>
          <p className="partner-login-desc">
            Fill in your registered host credentials to access your vehicle listing portal and revenue dashboard.
          </p>

          {errorMsg && (
            <div className="partner-login-error">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="partner-login-form">
            <div className="partner-login-form-group">
              <label>Partner Email / Registered Phone</label>
              <div className="partner-login-input-wrapper">
                <input 
                  type="text" 
                  className="partner-login-input"
                  placeholder="partner@vahan.rentals or 9876543210"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="partner-login-form-group">
              <label>Partner Access Passcode</label>
              <div className="partner-login-input-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className="partner-login-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="partner-login-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="partner-login-form-group">
              <label>Partner Host Category</label>
              <select 
                className="partner-login-select"
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
              >
                <option value="Bike & Scooty Host">🛵 Bike & Scooty Host (Rishikesh / Tapovan)</option>
                <option value="Car Fleet Host & Cab Owner">🚗 Car Fleet Host & Taxi Owner (Dehradun / Airport)</option>
                <option value="Franchise Hub Partner">📍 Franchise Hub Partner (Uttarakhand)</option>
              </select>
            </div>

            <div className="partner-login-actions-row">
              <label className="partner-login-remember">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Keep me logged in
              </label>

              <button 
                type="button" 
                className="partner-login-demo-btn"
                onClick={handleFillDemo}
              >
                ⚡ Auto Fill Partner Credentials
              </button>
            </div>

            <button 
              type="submit" 
              className="partner-login-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Authenticating Partner...'
              ) : (
                <>
                  Sign In to Partner Portal <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="partner-login-footer-info">
              <span><CheckCircle2 size={13} className="text-success" /> 256-Bit Encrypted Partner Session</span>
              <span><Shield size={13} className="text-success" /> Verified Partner Desk Active</span>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PartnerLogin;
