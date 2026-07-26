import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSuccess, title = "Login / Sign Up to Continue", subtitle = "Enter your details to receive a 1-time OTP verification code." }) => {
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' or 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1 = Input, 2 = OTP verification
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(30);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (authMethod === 'phone' && (!phone || phone.length < 10)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (authMethod === 'email' && (!email || !email.includes('@'))) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      // Auto-fill demo OTP 7060 for easy testing
      setOtp(['7', '0', '6', '0']);
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter the 4-digit OTP code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsSubmitting(false);
      const userData = {
        identifier: authMethod === 'phone' ? `+91 ${phone}` : email,
        name: 'Rider User',
        loggedInAt: new Date().toISOString()
      };
      localStorage.setItem('vahan_user_auth', JSON.stringify(userData));

      if (onSuccess) {
        onSuccess(userData);
      } else {
        onClose();
      }
    }, 600);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const resetFlow = () => {
    setStep(1);
    setErrorMsg('');
    setOtp(['', '', '', '']);
  };

  return (
    <AnimatePresence>
      <div className="auth-overlay">
        <motion.div 
          className="auth-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        <motion.div 
          className="auth-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <button className="auth-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
          
          <div className="auth-header">
            <div className="auth-brand-badge">
              <ShieldCheck size={16} /> SAFE & SECURE VERIFICATION
            </div>
            <h2>{step === 1 ? title : 'Verify OTP Code'}</h2>
            <p>
              {step === 1 
                ? subtitle
                : `Enter the 4-digit code sent to ${authMethod === 'phone' ? `+91 ${phone}` : email}`}
            </p>
          </div>

          {errorMsg && (
            <div className="auth-error-banner">
              {errorMsg}
            </div>
          )}

          {step === 1 ? (
            <>
              {/* Method Switcher */}
              <div className="auth-toggle">
                <button 
                  className={`auth-toggle-btn ${authMethod === 'phone' ? 'active' : ''}`}
                  onClick={() => { setAuthMethod('phone'); setErrorMsg(''); }}
                >
                  <Phone size={15} /> Mobile Number
                </button>
                <button 
                  className={`auth-toggle-btn ${authMethod === 'email' ? 'active' : ''}`}
                  onClick={() => { setAuthMethod('email'); setErrorMsg(''); }}
                >
                  <Mail size={15} /> Email Address
                </button>
              </div>

              {/* Step 1 Form */}
              <form className="auth-form" onSubmit={handleSendOtp}>
                {authMethod === 'phone' ? (
                  <div className="input-group phone-group">
                    <span className="country-code">+91</span>
                    <input 
                      type="tel" 
                      placeholder="70605 12661" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      maxLength={10}
                      required 
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="input-group">
                    <div className="input-icon"><Mail size={18} /></div>
                    <input 
                      type="email" 
                      placeholder="rider@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      autoFocus
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary btn-full auth-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending OTP...' : (
                    <>
                      Send OTP <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Step 2: OTP Verification */
            <form className="auth-form" onSubmit={handleVerifyOtp}>
              <div className="otp-box-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    className="otp-digit-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    maxLength={1}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <div className="otp-hint-text">
                Demo OTP pre-filled: <strong>7060</strong>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-full auth-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verifying...' : (
                  <>
                    <CheckCircle2 size={18} /> Verify & Complete Reservation
                  </>
                )}
              </button>

              <div className="resend-otp-row">
                <button type="button" className="btn-link-sm" onClick={resetFlow}>
                  <RotateCcw size={14} /> Change {authMethod === 'phone' ? 'Number' : 'Email'}
                </button>
              </div>
            </form>
          )}

          <div className="auth-footer-note">
            By continuing, you agree to vahan.rentals <a href="/terms-and-conditions" target="_blank">Terms</a> & <a href="/privacy-policy" target="_blank">Privacy Policy</a>.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
