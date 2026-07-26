import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Master Admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFillDemo = () => {
    setEmail('admin@vahan.rentals');
    setPassword('admin123');
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both admin email and passcode.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem('vahan_admin_auth', 'true');
      if (onLoginSuccess) {
        onLoginSuccess({ email, role });
      }
      navigate('/admin/dashboard');
    }, 600);
  };

  return (
    <div className="admin-login-wrapper">
      <motion.div 
        className="admin-login-card"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Left Column - Branding & Info Badge */}
        <div className="admin-login-left">
          <div className="admin-login-icon-circle">
            <ShieldCheck size={38} />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <Link to="/admin/login" className="admin-login-brand-link" style={{ textDecoration: 'none' }}>
              vahan<span>.rentals</span>
            </Link>
          </div>

          <h3>Admin Operations</h3>
          <p>
            Authorized management workspace for Uttarakhand's premier bike, car, and experience fleet.
          </p>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ea580c' }}>
              +91 70605 12661
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              24/7 Operations Desk Support
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="admin-login-right">
          <div className="admin-login-subtitle">SECURE ACCESS</div>
          <h2>Admin Portal Login</h2>
          <p className="admin-login-desc">
            Fill in your credentials to access the Vahan.Rentals fleet management, live reservations, and customer support desk.
          </p>

          {errorMsg && (
            <div className="admin-login-error">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-login-form-group">
              <label>Admin Email / Username</label>
              <div className="admin-login-input-wrapper">
                <input 
                  type="email" 
                  className="admin-login-input"
                  placeholder="admin@vahan.rentals"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-login-form-group">
              <label>Secret Passcode</label>
              <div className="admin-login-input-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className="admin-login-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="admin-login-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="admin-login-form-group">
              <label>Admin Role / Desk</label>
              <select 
                className="admin-login-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Master Admin">Master Admin (Full Access)</option>
                <option value="Fleet Operations">Fleet Operations Manager</option>
                <option value="Support Desk">Callback & Support Operator</option>
              </select>
            </div>

            <div className="admin-login-actions-row">
              <label className="admin-login-remember">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Keep me logged in
              </label>

              <button 
                type="button" 
                className="admin-login-demo-btn"
                onClick={handleFillDemo}
              >
                ⚡ Auto Fill Demo
              </button>
            </div>

            <button 
              type="submit" 
              className="admin-login-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Authenticating...'
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="admin-login-badges">
              <div className="admin-login-badge-item">
                <CheckCircle2 size={14} /> 256-Bit Encrypted Secure Session
              </div>
              <div className="admin-login-badge-item">
                <CheckCircle2 size={14} /> 24/7 Breakdown & Fleet Support Active
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
