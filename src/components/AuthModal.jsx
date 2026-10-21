import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import { sendOtpWithFirebase, verifyOtpWithFirebase } from '../services/apiService';
import './AuthModal.css';

const AuthModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  title = "Login / Sign Up to Continue", 
  subtitle = "Enter your email address to receive a 1-time OTP verification code." 
}) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1 = Input, 2 = OTP verification
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Invalid email address (e.g. name@example.com)');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await sendOtpWithFirebase(email.trim());
      setIsSubmitting(false);
      setStep(2);
      setOtp(['', '', '', '']);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to send OTP code. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter the complete 4-digit OTP code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await verifyOtpWithFirebase(email.trim(), enteredOtp);
      setIsSubmitting(false);

      const userData = {
        identifier: email.trim(),
        email: email.trim(),
        name: email.split('@')[0] || 'Rider User',
        uid: res.user?.uid || `user-${Date.now()}`,
        loggedInAt: new Date().toISOString()
      };
      localStorage.setItem('vahan_user_auth', JSON.stringify(userData));

      if (onSuccess) {
        onSuccess(userData);
      } else {
        onClose();
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Invalid OTP code. Please check and try again.');
    }
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
                : `Enter the 4-digit code sent to ${email}`}
            </p>
          </div>

          {errorMsg && (
            <div className="auth-error-banner">
              {errorMsg}
            </div>
          )}

          {step === 1 ? (
            <form className="auth-form" onSubmit={handleSendOtp}>
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

              <button 
                type="submit" 
                className="btn btn-primary btn-full auth-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verifying...' : (
                  <>
                    <CheckCircle2 size={18} /> Verify & Continue
                  </>
                )}
              </button>

              <div className="resend-otp-row">
                <button type="button" className="btn-link-sm" onClick={resetFlow}>
                  <RotateCcw size={14} /> Change Email
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
