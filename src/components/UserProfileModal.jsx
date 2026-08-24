import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Mail, Phone, FileCheck, Calendar, MapPin, 
  LogOut, ShieldCheck, Clock, CheckCircle2, ChevronRight, 
  History, Settings, HelpCircle, MessageSquare, ExternalLink,
  UploadCloud, AlertCircle, Sparkles, AlertTriangle, Lock, Star
} from 'lucide-react';
import './UserProfileModal.css';

const UserProfileModal = ({ isOpen, onClose, userAuth, onLogout, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'history' | 'security' | 'support'
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Rating Modal State
  const [ratingModalBooking, setRatingModalBooking] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Editable Profile States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  
  // Inline Validation Error State & Refs
  const [errors, setErrors] = useState({});
  const licenseInputRef = useRef(null);
  const nameInputRef = useRef(null);
  
  // Document Upload States
  const [dlFile, setDlFile] = useState(null);
  const [aadharFile, setAadharFile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('unverified'); // 'unverified' | 'pending' | 'verified'

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [kycSuccessMsg, setKycSuccessMsg] = useState('');

  // User Bookings History
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    if (isOpen && userAuth) {
      setShowLogoutConfirm(false);
      setEmail(userAuth.identifier || userAuth.email || '');
      setName(userAuth.name || (userAuth.identifier ? userAuth.identifier.split('@')[0] : 'Rider User'));
      setPhone(userAuth.phone || '');
      setLicenseNo(userAuth.licenseNo || '');
      setDlFile(userAuth.dlFile || (userAuth.dlFileName ? { name: userAuth.dlFileName, url: userAuth.dlFileUrl } : null));
      setAadharFile(userAuth.aadharFile || (userAuth.aadharFileName ? { name: userAuth.aadharFileName, url: userAuth.aadharFileUrl } : null));
      setVerificationStatus(userAuth.verificationStatus || 'unverified');

      // Fetch user bookings from localStorage
      try {
        const bookings = JSON.parse(localStorage.getItem('vahan_user_bookings') || '[]');
        setUserBookings(bookings);
      } catch (err) {
        setUserBookings([]);
      }
    }
  }, [isOpen, userAuth]);

  const handleOpenRatingModal = (booking) => {
    setRatingModalBooking(booking);
    setRatingStars(booking.userRating || 5);
    setHoverStars(0);
    setReviewText(booking.userReview || '');
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    if (!ratingModalBooking) return;

    const updatedBookings = userBookings.map((b) => {
      const isMatch = (b.bookingId && b.bookingId === ratingModalBooking.bookingId) || 
                      (b.id && b.id === ratingModalBooking.id);
      if (isMatch) {
        return {
          ...b,
          status: 'Completed',
          userRating: ratingStars,
          userReview: reviewText,
          ratedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
      }
      return b;
    });

    setUserBookings(updatedBookings);
    localStorage.setItem('vahan_user_bookings', JSON.stringify(updatedBookings));
    setRatingModalBooking(null);
  };

  if (!isOpen || !userAuth) return null;

  const handleDlUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDlFile({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadharUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadharFile({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    const updatedUser = {
      ...userAuth,
      name,
      identifier: email,
      email,
      phone,
      licenseNo,
      dlFile,
      dlFileName: dlFile ? dlFile.name : '',
      dlFileUrl: dlFile ? dlFile.url : null,
      aadharFile,
      aadharFileName: aadharFile ? aadharFile.name : '',
      aadharFileUrl: aadharFile ? aadharFile.url : null,
      verificationStatus
    };
    localStorage.setItem('vahan_user_auth', JSON.stringify(updatedUser));
    if (onProfileUpdate) onProfileUpdate(updatedUser);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRequestVerification = () => {
    const newErrors = {};
    if (!licenseNo.trim()) {
      newErrors.licenseNo = 'Please enter your Driving License / Govt ID number first.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setActiveTab('profile');
      if (newErrors.licenseNo && licenseInputRef.current) {
        licenseInputRef.current.focus();
        licenseInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    const newStatus = 'pending';
    setVerificationStatus(newStatus);

    const updatedUser = {
      ...userAuth,
      name,
      identifier: email,
      email,
      phone,
      licenseNo,
      dlFile,
      dlFileName: dlFile ? dlFile.name : '',
      dlFileUrl: dlFile ? dlFile.url : null,
      aadharFile,
      aadharFileName: aadharFile ? aadharFile.name : '',
      aadharFileUrl: aadharFile ? aadharFile.url : null,
      verificationStatus: newStatus,
      kycRequestedAt: new Date().toISOString()
    };

    localStorage.setItem('vahan_user_auth', JSON.stringify(updatedUser));

    // Push into global admin KYC requests array in localStorage
    try {
      const kycRequests = JSON.parse(localStorage.getItem('vahan_admin_kyc_requests') || '[]');
      const filtered = kycRequests.filter(r => r.email !== email);
      localStorage.setItem('vahan_admin_kyc_requests', JSON.stringify([updatedUser, ...filtered]));
    } catch (err) {
      console.error(err);
    }

    if (onProfileUpdate) onProfileUpdate(updatedUser);

    setKycSuccessMsg('KYC Verification request submitted! Our admin desk will review your documents shortly.');
    setTimeout(() => setKycSuccessMsg(''), 5000);
  };

  return (
    <AnimatePresence>
      <div className="profile-modal-overlay">
        <motion.div 
          className="profile-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div 
          className="profile-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="profile-modal-header">
            <div className="profile-user-summary">
              <div className="profile-avatar">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="profile-title-block">
                <span className={`profile-badge ${verificationStatus}`}>
                  {verificationStatus === 'verified' && <><CheckCircle2 size={12} /> KYC Verified Renter</>}
                  {verificationStatus === 'pending' && <><Clock size={12} /> Verification Under Review</>}
                  {verificationStatus === 'unverified' && <><AlertCircle size={12} /> Unverified Member</>}
                </span>
                <h3 className="profile-name">{name || 'Rider User'}</h3>
                <p className="profile-email">{email}</p>
              </div>
            </div>

            <div className="profile-header-actions">
              <button className="profile-logout-btn" onClick={() => setShowLogoutConfirm(true)} title="Logout Account">
                <LogOut size={16} /> Logout
              </button>
              <button className="profile-close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="profile-tabs">
            <button 
              className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <Settings size={16} /> Profile & Documents
            </button>
            <button 
              className={`profile-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={16} /> Service & Booking History
            </button>
            <button 
              className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <ShieldCheck size={16} /> Verification Status
            </button>
            <button 
              className={`profile-tab ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => setActiveTab('support')}
            >
              <HelpCircle size={16} /> Support Desk
            </button>
          </div>

          {/* Tab 1: Profile & Document Management */}
          {activeTab === 'profile' && (
            <form className="profile-tab-content" onSubmit={handleSaveProfile}>
              <div className="content-heading-row">
                <h4>Manage Personal Details & Verification Documents</h4>
              </div>

              {/* Status Banner */}
              {verificationStatus === 'verified' && (
                <div className="kyc-status-banner verified">
                  <Sparkles size={18} />
                  <div>
                    <strong>ADMIN VERIFIED RENTER ACTIVE</strong>
                    <p>Your documents have been verified by admin. Document verification will be skipped automatically on all future vehicle rentals!</p>
                  </div>
                </div>
              )}

              {verificationStatus === 'pending' && (
                <div className="kyc-status-banner pending">
                  <Clock size={18} />
                  <div>
                    <strong>VERIFICATION REQUEST UNDER REVIEW</strong>
                    <p>Your documents are being reviewed by the Rishikesh admin desk. Once approved, you get instant express checkout.</p>
                  </div>
                </div>
              )}

              {savedSuccess && (
                <div className="save-success-banner">
                  <CheckCircle2 size={16} /> Profile & document details saved successfully!
                </div>
              )}

              {kycSuccessMsg && (
                <div className="save-success-banner" style={{ background: '#e0f2fe', borderColor: '#7dd3fc', color: '#0369a1' }}>
                  <Clock size={16} /> {kycSuccessMsg}
                </div>
              )}

              <div className="profile-form-grid">
                <div className="profile-field">
                  <label>
                    Full Name 
                    {verificationStatus === 'verified' && <span className="locked-tag"><Lock size={11} /> Locked</span>}
                  </label>
                  <div className="profile-input-wrap">
                    <User size={16} className="profile-icon" />
                    <input 
                      ref={nameInputRef}
                      type="text" 
                      value={name} 
                      disabled={verificationStatus === 'verified'}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                      }} 
                      placeholder="e.g. Vikas Kumar"
                      className={`${verificationStatus === 'verified' ? 'locked-input' : ''} ${errors.name ? 'error-border' : ''}`}
                    />
                  </div>
                  {errors.name && <span className="prof-err-msg"><AlertCircle size={12} /> {errors.name}</span>}
                </div>

                <div className="profile-field">
                  <label>
                    Email Address 
                    <span className="locked-tag" style={{ background: '#dcfce7', color: '#166534' }}>
                      <CheckCircle2 size={11} /> OTP Verified & Locked
                    </span>
                  </label>
                  <div className="profile-input-wrap">
                    <Mail size={16} className="profile-icon" />
                    <input 
                      type="email" 
                      value={email} 
                      disabled={true}
                      readOnly
                      placeholder="user@example.com"
                      className="locked-input"
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label>
                    Mobile Number (WhatsApp) 
                    {verificationStatus === 'verified' && <span className="locked-tag"><Lock size={11} /> Locked</span>}
                  </label>
                  <div className="profile-input-wrap">
                    <Phone size={16} className="profile-icon" />
                    <input 
                      type="tel" 
                      value={phone} 
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      disabled={verificationStatus === 'verified'}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone(digitsOnly);
                      }} 
                      placeholder="e.g. 7060512661"
                      className={verificationStatus === 'verified' ? 'locked-input' : ''}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label>
                    Driving License / Govt ID Number 
                    {verificationStatus === 'verified' ? (
                      <span className="locked-tag"><Lock size={11} /> Verified & Locked</span>
                    ) : (
                      <span className="req-star" style={{ color: '#ef4444' }}>*</span>
                    )}
                  </label>
                  <div className="profile-input-wrap">
                    <FileCheck size={16} className={`profile-icon ${errors.licenseNo ? 'text-danger' : ''}`} />
                    <input 
                      ref={licenseInputRef}
                      type="text" 
                      value={licenseNo} 
                      disabled={verificationStatus === 'verified'}
                      onChange={(e) => {
                        setLicenseNo(e.target.value);
                        if (errors.licenseNo) setErrors(prev => ({ ...prev, licenseNo: null }));
                      }} 
                      placeholder="e.g. UK0720210098412"
                      className={`${verificationStatus === 'verified' ? 'locked-input' : ''} ${errors.licenseNo ? 'error-border' : ''}`}
                    />
                  </div>
                  {errors.licenseNo && <span className="prof-err-msg"><AlertCircle size={12} /> {errors.licenseNo}</span>}
                </div>
              </div>

              {/* Driving License & ID Document Upload Section */}
              <div className="prof-doc-upload-section">
                <h5>
                  <UploadCloud size={16} className="text-primary" /> 
                  {verificationStatus === 'verified' ? 'Verified Identification Documents (Locked)' : 'Upload Identification Documents for Verification'}
                </h5>
                
                <div className="prof-upload-grid">
                  {/* DL Upload Box */}
                  <div className="prof-upload-box">
                    <label>Driving License Photo / PDF</label>
                    <div className={`prof-dropzone ${verificationStatus === 'verified' ? 'locked-dropzone' : dlFile ? 'has-file' : ''}`}>
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        id="prof-dl-input" 
                        className="file-input-hidden" 
                        disabled={verificationStatus === 'verified'}
                        onChange={handleDlUpload}
                      />
                      {dlFile ? (
                        <div className="uploaded-file-row">
                          <CheckCircle2 size={16} className="text-success" />
                          <span className="file-name">{dlFile.name}</span>
                          {verificationStatus !== 'verified' && (
                            <button type="button" className="remove-file-btn" onClick={() => setDlFile(null)}>
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <label htmlFor="prof-dl-input" className={`prof-dropzone-label ${verificationStatus === 'verified' ? 'disabled-label' : ''}`}>
                          {verificationStatus === 'verified' ? <Lock size={20} className="text-muted" /> : <UploadCloud size={20} className="text-primary" />}
                          <span>{verificationStatus === 'verified' ? 'Document Verified by Admin' : 'Click to Upload Driving License'}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Aadhar Upload Box */}
                  <div className="prof-upload-box">
                    <label>Aadhar Card / Passport Photo</label>
                    <div className={`prof-dropzone ${verificationStatus === 'verified' ? 'locked-dropzone' : aadharFile ? 'has-file' : ''}`}>
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        id="prof-aadhar-input" 
                        className="file-input-hidden" 
                        disabled={verificationStatus === 'verified'}
                        onChange={handleAadharUpload}
                      />
                      {aadharFile ? (
                        <div className="uploaded-file-row">
                          <CheckCircle2 size={16} className="text-success" />
                          <span className="file-name">{aadharFile.name}</span>
                          {verificationStatus !== 'verified' && (
                            <button type="button" className="remove-file-btn" onClick={() => setAadharFile(null)}>
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <label htmlFor="prof-aadhar-input" className={`prof-dropzone-label ${verificationStatus === 'verified' ? 'disabled-label' : ''}`}>
                          {verificationStatus === 'verified' ? <Lock size={20} className="text-muted" /> : <UploadCloud size={20} className="text-primary" />}
                          <span>{verificationStatus === 'verified' ? 'Document Verified by Admin' : 'Click to Upload Aadhar Card'}</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="profile-action-buttons">
                {verificationStatus === 'verified' ? (
                  <div className="verified-lock-notice">
                    <Lock size={16} /> 
                    <span><strong>Verified KYC Profile Locked</strong> — To request edits to your verified identity documents, please contact Rishikesh Desk Support.</span>
                  </div>
                ) : (
                  <>
                    <button type="submit" className="btn btn-outline save-profile-btn">
                      <CheckCircle2 size={18} /> Save Changes
                    </button>

                    <button 
                      type="button" 
                      className="btn btn-primary req-verify-btn"
                      onClick={handleRequestVerification}
                      disabled={verificationStatus === 'pending'}
                    >
                      <ShieldCheck size={18} />
                      {verificationStatus === 'pending' ? 'Verification Request Sent ⏳' : 'Request Profile Verification Badge'}
                    </button>
                  </>
                )}
              </div>

            </form>
          )}

          {/* Tab 2: Service & Booking History */}
          {activeTab === 'history' && (
            <div className="profile-tab-content">
              <div className="content-heading-row">
                <h4>Your Vehicle Rentals & Reservations ({userBookings.length})</h4>
              </div>

              {userBookings.length === 0 ? (
                <div className="empty-history-box">
                  <Clock size={40} className="empty-icon" />
                  <h4>No Active Rentals Yet</h4>
                  <p>You haven't reserved any bikes or cars yet. Start exploring Uttarakhand's best rentals!</p>
                  <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '12px' }}>
                    Explore Vehicles Now
                  </button>
                </div>
              ) : (
                <div className="booking-history-list">
                  {userBookings.map((b, idx) => (
                    <div className="history-item-card" key={b.bookingId || idx}>
                      <div className="history-card-header">
                        <span className="booking-ref-badge">Ref: {b.bookingId}</span>
                        <span className="booking-status-pill">{b.status || 'Confirmed'}</span>
                      </div>

                      <div className="history-card-body">
                        {b.vehicleImage && (
                          <img src={b.vehicleImage} alt={b.vehicleTitle} className="history-thumb" />
                        )}
                        <div className="history-details">
                          <h5>{b.vehicleTitle || 'Vehicle Booking'}</h5>
                          <p><MapPin size={13} /> {b.pickupLocation || 'Rishikesh'} Hub</p>
                          <p><Calendar size={13} /> {b.formattedStartDate || b.startDate} to {b.formattedEndDate || b.endDate}</p>
                        </div>
                        <div className="history-pricing">
                          <span className="price-label">Total Fare</span>
                          <span className="price-value">₹{b.totalAmount}</span>
                          {b.totalAmountToPayNow && (
                            <span className="paid-badge">₹{b.totalAmountToPayNow} Paid Online</span>
                          )}
                        </div>
                      </div>

                      <div className="history-card-footer">
                        <a 
                          href={`https://wa.me/917060512661?text=${encodeURIComponent(`Hi Vahan Rentals, I need assistance for my booking ${b.bookingId} (${b.vehicleTitle}).`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="history-wa-btn"
                        >
                          <MessageSquare size={14} /> WhatsApp Desk Support
                        </a>

                        {b.userRating ? (
                          <div className="user-rating-submitted-pill">
                            <Star size={14} className="star-filled-icon" />
                            <span>Rated {b.userRating} / 5 Stars</span>
                            <span className="rating-submitted-check">✓ Feedback Submitted</span>
                          </div>
                        ) : (
                          <button 
                            type="button" 
                            className="btn-rate-trip-action"
                            onClick={() => handleOpenRatingModal(b)}
                          >
                            <Star size={14} /> Rate Trip Experience (Out of 5 Stars)
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Verification & Security */}
          {activeTab === 'security' && (
            <div className="profile-tab-content">
              <div className="content-heading-row">
                <h4>Account Safety & Admin Verification Status</h4>
              </div>

              <div className="security-cards-grid">
                <div className={`sec-card ${verificationStatus === 'verified' ? 'green' : 'blue'}`}>
                  <ShieldCheck size={24} className={`sec-icon ${verificationStatus === 'verified' ? 'green' : 'blue'}`} />
                  <div>
                    <h5>KYC Admin Verification Status</h5>
                    <p>
                      {verificationStatus === 'verified' && '✅ Verified Renter! Document upload skipped for all future rentals.'}
                      {verificationStatus === 'pending' && '⏳ Verification request submitted to admin desk for review.'}
                      {verificationStatus === 'unverified' && '⚠️ Unverified. Fill details & click "Request Profile Verification Badge".'}
                    </p>
                  </div>
                </div>

                <div className="sec-card green">
                  <CheckCircle2 size={24} className="sec-icon green" />
                  <div>
                    <h5>Email Address Verified</h5>
                    <p>{email} is authenticated via 1-time OTP verification.</p>
                  </div>
                </div>

                <div className="sec-card blue">
                  <ShieldCheck size={24} className="sec-icon blue" />
                  <div>
                    <h5>256-Bit SSL Data Privacy</h5>
                    <p>Your document data is encrypted according to vahan.rentals privacy standards.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Support Desk */}
          {activeTab === 'support' && (
            <div className="profile-tab-content">
              <div className="content-heading-row">
                <h4>24/7 Rishikesh Travel & Rental Support</h4>
              </div>

              <div className="support-info-box">
                <div className="support-row">
                  <Phone size={18} className="text-primary" />
                  <div>
                    <strong>24/7 Helpline Number:</strong>
                    <p>+91 70605 12661 / +91 98970 00000</p>
                  </div>
                </div>

                <div className="support-row">
                  <MessageSquare size={18} className="text-success" />
                  <div>
                    <strong>WhatsApp Instant Support:</strong>
                    <p>Quick chat for pickup queries, extensions & refunds.</p>
                    <a 
                      href="https://wa.me/917060512661" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="support-link-btn"
                    >
                      Open WhatsApp Desk <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                <div className="support-row">
                  <MapPin size={18} className="text-primary" />
                  <div>
                    <strong>Main Station Desk:</strong>
                    <p>Laxman Jhula Main Road, Near Tapovan Taxi Stand, Rishikesh, Uttarakhand</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </div>

      {/* Logout Confirmation Dialog Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="logout-confirm-overlay">
            <motion.div 
              className="logout-confirm-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div 
              className="logout-confirm-modal"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.2 }}
            >
              <div className="logout-icon-wrap">
                <AlertTriangle size={30} />
              </div>

              <h3 className="logout-confirm-title">Confirm Account Logout</h3>
              <p className="logout-confirm-sub">
                Are you sure you want to log out of <strong>{email}</strong>? You will need to verify your email again to view active reservations.
              </p>

              <div className="logout-confirm-actions">
                <button 
                  type="button"
                  className="btn btn-outline cancel-logout-btn" 
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="btn confirm-logout-btn" 
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    onLogout();
                  }}
                >
                  <LogOut size={16} /> Yes, Confirm Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Interactive 5-Star Rating & Review Dialog */}
      <AnimatePresence>
        {ratingModalBooking && (
          <div className="rating-modal-overlay">
            <motion.div 
              className="rating-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRatingModalBooking(null)}
            />
            <motion.div 
              className="rating-modal-card"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
            >
              <div className="rating-modal-header">
                <h3>Rate Your Rental Experience</h3>
                <button onClick={() => setRatingModalBooking(null)} className="rating-modal-close"><X size={18} /></button>
              </div>

              <div className="rating-vehicle-summary">
                {ratingModalBooking.vehicleImage && (
                  <img src={ratingModalBooking.vehicleImage} alt={ratingModalBooking.vehicleTitle} className="rating-v-thumb" />
                )}
                <div>
                  <h4>{ratingModalBooking.vehicleTitle || 'Vehicle Rental'}</h4>
                  <p>Ref: <strong>{ratingModalBooking.bookingId}</strong> • {ratingModalBooking.pickupLocation || 'Rishikesh'}</p>
                </div>
              </div>

              <form onSubmit={handleSubmitRating} className="rating-form">
                <div className="star-rating-picker-box">
                  <label className="picker-label">How was your trip experience?</label>
                  
                  <div className="stars-interactive-row">
                    {[1, 2, 3, 4, 5].map((starIndex) => {
                      const isActive = starIndex <= (hoverStars || ratingStars);
                      return (
                        <button
                          key={starIndex}
                          type="button"
                          className={`star-pick-btn ${isActive ? 'star-active' : ''}`}
                          onClick={() => setRatingStars(starIndex)}
                          onMouseEnter={() => setHoverStars(starIndex)}
                          onMouseLeave={() => setHoverStars(0)}
                          title={`${starIndex} Star${starIndex > 1 ? 's' : ''}`}
                        >
                          <Star size={32} className={isActive ? 'filled-star' : 'empty-star'} />
                        </button>
                      );
                    })}
                  </div>

                  <span className="star-rating-caption">
                    {(hoverStars || ratingStars) === 1 && '🙁 Poor Experience'}
                    {(hoverStars || ratingStars) === 2 && '😐 Below Average'}
                    {(hoverStars || ratingStars) === 3 && '🙂 Average / Okay Trip'}
                    {(hoverStars || ratingStars) === 4 && '😀 Great Experience!'}
                    {(hoverStars || ratingStars) === 5 && '🌟 Excellent & Outstanding! (5/5 Stars)'}
                  </span>
                </div>

                <div className="rating-form-group">
                  <label>Share your feedback with Vahan Rentals (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Tell us how the vehicle condition, pickup desk service, and helmet quality was..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>

                <div className="rating-modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setRatingModalBooking(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary submit-rating-btn">
                    <Star size={16} /> Submit 5-Star Rating
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default UserProfileModal;
