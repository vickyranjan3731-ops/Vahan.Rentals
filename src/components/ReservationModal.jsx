import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, MapPin, User, Phone, FileCheck, ShieldCheck, 
  CreditCard, CheckCircle2, ChevronRight, UploadCloud, 
  Mail, Lock, QrCode, Building2, ArrowLeft, RefreshCw, Sparkles 
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ReservationModal.css';

const ReservationModal = ({
  isOpen,
  onClose,
  vehicle,
  initialStartDate,
  initialEndDate,
  initialLocation,
  onReservationSuccess
}) => {
  // Step state: 'registration' | 'email_verify' | 'payment'
  const [currentStep, setCurrentStep] = useState('registration');

  // Registration Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Rishikesh');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  });
  const [paymentMethod, setPaymentMethod] = useState('pickup');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Document Upload States
  const [dlFile, setDlFile] = useState(null);
  const [aadharFile, setAadharFile] = useState(null);

  // Email Verification States
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpError, setOtpError] = useState('');

  // Payment Gateway States
  const [payGatewayTab, setPayGatewayTab] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isKycVerified, setIsKycVerified] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved user info if logged in
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('registration');
      setOtp('');
      setIsOtpSent(false);
      const savedUser = localStorage.getItem('vahan_user_auth');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.name) setFullName(parsed.name);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.licenseNo) setLicenseNo(parsed.licenseNo);
          if (parsed.dlFile) setDlFile(parsed.dlFile);
          if (parsed.aadharFile) setAadharFile(parsed.aadharFile);
          if (parsed.verificationStatus === 'verified') setIsKycVerified(true);
          else setIsKycVerified(false);

          if (parsed.identifier) {
            if (parsed.identifier.includes('@')) {
              setEmail(parsed.identifier);
              if (!parsed.name) setFullName(parsed.identifier.split('@')[0]);
            } else {
              if (!parsed.phone) setPhone(parsed.identifier);
              setEmail(`${parsed.identifier}@gmail.com`);
            }
          }
        } catch (e) {
          // ignore
        }
      }
      if (initialStartDate) setStartDate(initialStartDate);
      if (initialEndDate) setEndDate(initialEndDate);
      if (initialLocation) setPickupLocation(initialLocation);
    }
  }, [isOpen, initialStartDate, initialEndDate, initialLocation]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval;
    if (isOtpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, otpTimer]);

  if (!isOpen || !vehicle) return null;

  // Check if vehicle is Car / Four-wheeler
  const isCarVehicle = (v) => {
    if (!v) return false;
    const cat = (v.category || '').toLowerCase();
    const title = (v.title || '').toLowerCase();
    const type = (v.type || '').toLowerCase();
    return (
      cat.includes('car') || 
      cat.includes('cab') || 
      cat.includes('suv') || 
      cat.includes('sedan') || 
      cat.includes('hatchback') || 
      title.includes('thar') || 
      title.includes('swift') || 
      title.includes('creta') || 
      title.includes('ertiga') || 
      title.includes('innova') || 
      title.includes('baleno') ||
      title.includes('scorpio') ||
      type === 'car'
    );
  };

  const isCar = isCarVehicle(vehicle);
  const tokenAmount = isCar ? 500 : 100;

  // Extract numeric daily rate
  const getNumericPrice = (priceStr) => {
    if (!priceStr) return 800;
    if (typeof priceStr === 'number') return priceStr;
    const num = priceStr.replace(/[^0-9]/g, '');
    return num ? parseInt(num, 10) : 800;
  };

  const dailyRate = getNumericPrice(vehicle.price);
  
  // Calculate total rental days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const rentalDays = calculateDays();
  const basePrice = dailyRate * rentalDays;
  const securityDeposit = 1000;

  // Pricing calculations based on payment method
  const totalPayable = paymentMethod === 'pickup' ? Math.min(tokenAmount, basePrice) : basePrice;
  const remainingAtPickup = paymentMethod === 'pickup' ? Math.max(0, basePrice - totalPayable) : 0;

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      if (!endDate || endDate <= date) {
        setEndDate(nextDay);
      }
    }
  };

  const handleDlUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDlFile({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadharUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadharFile({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateRegistrationForm = () => {
    const errs = {};
    if (!fullName || !fullName.trim()) errs.fullName = 'Full Name is required';
    if (!phone || !phone.trim() || phone.trim().replace(/\D/g, '').length < 10) errs.phone = 'Valid 10-digit Mobile Number required';
    if (!licenseNo || !licenseNo.trim()) errs.licenseNo = 'Driving License / Govt ID number required';
    if (!startDate) errs.startDate = 'Select start date';
    if (!endDate) errs.endDate = 'Select end date';
    if (!agreedTerms) errs.agreedTerms = 'You must accept terms & helmet safety policy';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 1 -> Step 2: Form submission to Email Verification
  const handleProceedToEmailVerification = (e) => {
    e.preventDefault();
    if (!validateRegistrationForm()) return;
    setCurrentStep('email_verify');
    if (!email) {
      setEmail(`${phone.replace(/\D/g, '') || 'user'}@gmail.com`);
    }
  };

  // Trigger Send OTP for Email
  const handleSendOtp = () => {
    if (!email || !email.includes('@')) {
      setOtpError('Please enter a valid email address');
      return;
    }
    setOtpError('');
    setIsOtpSent(true);
    setOtpTimer(30);
    setOtp('582914'); // Pre-fill demo OTP for convenient user testing!
  };

  // Step 2 -> Step 3: Verify Email OTP to Payment Gateway
  const handleVerifyEmailOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      setOtpError('Please enter 6-digit OTP code sent to your email');
      return;
    }
    setOtpError('');
    setCurrentStep('payment');
  };

  // Step 3: Final Payment Execution
  const handleExecutePayment = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    const bookingId = `VR-${Math.floor(10000 + Math.random() * 90000)}`;
    const paymentTxnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    const reservationData = {
      bookingId,
      paymentTxnId,
      vehicleId: vehicle.id,
      vehicleTitle: vehicle.title,
      vehicleImage: vehicle.image,
      category: isCar ? 'Car / Cab' : 'Bike / Scooty',
      isCar,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      licenseNo: licenseNo.trim(),
      dlFileName: dlFile ? dlFile.name : 'Attached at Counter',
      dlFileUrl: dlFile ? dlFile.url : null,
      aadharFileName: aadharFile ? aadharFile.name : 'Attached at Counter',
      aadharFileUrl: aadharFile ? aadharFile.url : null,
      pickupLocation,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      formattedStartDate: startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      formattedEndDate: endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      rentalDays,
      dailyRate,
      basePrice,
      securityDeposit,
      tokenAmount,
      totalAmountToPayNow: totalPayable,
      remainingAmountAtPickup: remainingAtPickup,
      paymentMethod,
      payGatewayTab,
      totalAmount: basePrice,
      status: 'Confirmed & Token Paid',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setIsProcessingPayment(false);

      // Save into admin & user localStorage bookings
      try {
        const existingBookings = JSON.parse(localStorage.getItem('vahan_admin_bookings') || '[]');
        localStorage.setItem('vahan_admin_bookings', JSON.stringify([reservationData, ...existingBookings]));

        const userBookings = JSON.parse(localStorage.getItem('vahan_user_bookings') || '[]');
        localStorage.setItem('vahan_user_bookings', JSON.stringify([reservationData, ...userBookings]));
      } catch (err) {
        console.error(err);
      }

      if (onReservationSuccess) {
        onReservationSuccess(reservationData);
      }
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="res-modal-overlay">
        <motion.div 
          className="res-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div 
          className="res-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Modal Header */}
          <div className="res-modal-header">
            <div>
              <span className="res-badge">vahan.rentals • Official Reservation</span>
              <h2 className="res-title">
                {currentStep === 'registration' && '1. Complete Registration Details'}
                {currentStep === 'email_verify' && '2. Email Address Verification'}
                {currentStep === 'payment' && '3. Secure Payment Gateway'}
              </h2>
            </div>
            <button className="res-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Steps Progress Indicator Bar */}
          <div className="res-steps-progress">
            <div className={`step-item ${currentStep === 'registration' ? 'active' : 'completed'}`}>
              <span className="step-num">1</span>
              <span className="step-name">Details</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${currentStep === 'email_verify' ? 'active' : currentStep === 'payment' ? 'completed' : ''}`}>
              <span className="step-num">2</span>
              <span className="step-name">Email OTP</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${currentStep === 'payment' ? 'active' : ''}`}>
              <span className="step-num">3</span>
              <span className="step-name">Payment</span>
            </div>
          </div>

          {/* Vehicle Info Summary Bar */}
          <div className="res-vehicle-bar">
            <img src={vehicle.image} alt={vehicle.title} className="res-vehicle-thumb" />
            <div className="res-vehicle-info">
              <h3>{vehicle.title}</h3>
              <p>
                <MapPin size={13} /> {vehicle.location || pickupLocation} • <span className="res-rate-pill">₹{dailyRate}/day</span> • <span style={{ color: '#0284c7', fontWeight: 600 }}>{isCar ? '🚗 Car' : '🛵 Bike'}</span>
              </p>
            </div>
          </div>

          {/* STEP 1: Registration Form */}
          {currentStep === 'registration' && (
            <form className="res-form" onSubmit={handleProceedToEmailVerification}>

              {/* Section 1: Customer Details */}
              <div className="res-form-section">
                <h4 className="res-section-title">
                  <User size={16} className="text-primary" /> Primary Renter Details & Verification
                </h4>
                <div className="res-input-grid">
                  <div className="res-field">
                    <label>Full Name <span className="req">*</span></label>
                    <div className="res-input-wrap">
                      <User size={16} className="res-input-icon" />
                      <input 
                        type="text" 
                        placeholder="e.g. Rahul Sharma" 
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }));
                        }}
                        className={errors.fullName ? 'error' : ''}
                      />
                    </div>
                    {errors.fullName && <span className="err-msg">{errors.fullName}</span>}
                  </div>

                  <div className="res-field">
                    <label>Mobile Number (WhatsApp) <span className="req">*</span></label>
                    <div className="res-input-wrap">
                      <Phone size={16} className="res-input-icon" />
                      <input 
                        type="tel" 
                        placeholder="e.g. 9876543210" 
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                        }}
                        className={errors.phone ? 'error' : ''}
                      />
                    </div>
                    {errors.phone && <span className="err-msg">{errors.phone}</span>}
                  </div>
                </div>

                <div className="res-field" style={{ marginTop: '0.85rem' }}>
                  <label>Driving License / Govt ID Number <span className="req">*</span></label>
                  <div className="res-input-wrap">
                    <FileCheck size={16} className="res-input-icon" />
                    <input 
                      type="text" 
                      placeholder="e.g. UK0720210098412 or Aadhar No." 
                      value={licenseNo}
                      onChange={(e) => {
                        setLicenseNo(e.target.value);
                        if (errors.licenseNo) setErrors(prev => ({ ...prev, licenseNo: null }));
                      }}
                      className={errors.licenseNo ? 'error' : ''}
                    />
                  </div>
                  {errors.licenseNo && <span className="err-msg">{errors.licenseNo}</span>}
                </div>

                {/* Document Upload Area */}
                {isKycVerified ? (
                  <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '12px 14px', borderRadius: '10px', fontSize: '0.82rem', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.85rem' }}>⚡ KYC VERIFIED RENTER (EXPRESS CHECKOUT)</strong>
                      <p style={{ margin: '2px 0 0 0' }}>Your driving license & identity are pre-verified by Admin. Document upload skipped for fast checkout!</p>
                    </div>
                  </div>
                ) : (
                  <div className="res-upload-container">
                    <h5 className="res-sub-title">
                      <UploadCloud size={15} className="text-primary" /> Upload ID Verification Documents
                    </h5>
                    
                    <div className="res-upload-grid">
                      {/* Driving License Upload */}
                      <div className="upload-box">
                        <label className="upload-label">Driving License Document / Photo</label>
                        <div className={`upload-dropzone ${dlFile ? 'has-file' : ''}`}>
                          <input 
                            type="file" 
                            accept="image/*,application/pdf" 
                            onChange={handleDlUpload}
                            id="dl-file-input"
                            className="file-input-hidden"
                          />
                          {dlFile ? (
                            <div className="uploaded-file-info">
                              <CheckCircle2 size={18} className="text-success" />
                              <div className="file-details">
                                <span className="file-name">{dlFile.name}</span>
                                <span className="file-size">{dlFile.size}</span>
                              </div>
                              <button type="button" className="remove-file-btn" onClick={() => setDlFile(null)}>
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <label htmlFor="dl-file-input" className="dropzone-content">
                              <UploadCloud size={20} className="upload-icon" />
                              <span className="prompt-text">Upload <strong>Driving License</strong></span>
                              <span className="prompt-sub">JPG, PNG, PDF</span>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Aadhar Card Upload */}
                      <div className="upload-box">
                        <label className="upload-label">Aadhar Card / Passport Photo</label>
                        <div className={`upload-dropzone ${aadharFile ? 'has-file' : ''}`}>
                          <input 
                            type="file" 
                            accept="image/*,application/pdf" 
                            onChange={handleAadharUpload}
                            id="aadhar-file-input"
                            className="file-input-hidden"
                          />
                          {aadharFile ? (
                            <div className="uploaded-file-info">
                              <CheckCircle2 size={18} className="text-success" />
                              <div className="file-details">
                                <span className="file-name">{aadharFile.name}</span>
                                <span className="file-size">{aadharFile.size}</span>
                              </div>
                              <button type="button" className="remove-file-btn" onClick={() => setAadharFile(null)}>
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <label htmlFor="aadhar-file-input" className="dropzone-content">
                              <UploadCloud size={20} className="upload-icon" />
                              <span className="prompt-text">Upload <strong>Aadhar Card</strong></span>
                              <span className="prompt-sub">JPG, PNG, PDF</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Section 2: Dates & Location */}
              <div className="res-form-section">
                <h4 className="res-section-title">
                  <Calendar size={16} className="text-primary" /> Schedule & Pickup Location
                </h4>
                
                <div className="res-input-grid">
                  <div className="res-field">
                    <label>Start Date</label>
                    <div className="res-input-wrap">
                      <Calendar size={16} className="res-input-icon" />
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        minDate={new Date()}
                        dateFormat="dd MMM yyyy"
                        className="res-datepicker-input"
                      />
                    </div>
                  </div>

                  <div className="res-field">
                    <label>End Date</label>
                    <div className="res-input-wrap">
                      <Calendar size={16} className="res-input-icon" />
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        minDate={startDate || new Date()}
                        dateFormat="dd MMM yyyy"
                        className="res-datepicker-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="res-field" style={{ marginTop: '0.85rem' }}>
                  <label>Pickup Location</label>
                  <div className="res-input-wrap">
                    <MapPin size={16} className="res-input-icon" />
                    <select 
                      value={pickupLocation} 
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="res-select"
                    >
                      <option value="Rishikesh">Rishikesh (Main Hub - Laxman Jhula)</option>
                      <option value="Dehradun">Dehradun (ISBT / Railway Station)</option>
                      <option value="Haridwar">Haridwar (Near Station)</option>
                      <option value="Mussoorie">Mussoorie (Mall Road Counter)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Option & Fare Summary */}
              <div className="res-form-section">
                <h4 className="res-section-title">
                  <CreditCard size={16} className="text-primary" /> Payment Preference & Fare
                </h4>

                <div className="res-payment-options">
                  <label className={`res-pay-card ${paymentMethod === 'pickup' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="payOpt" 
                      value="pickup" 
                      checked={paymentMethod === 'pickup'}
                      onChange={() => setPaymentMethod('pickup')}
                    />
                    <div>
                      <span className="pay-title">Pay at Pickup Counter (Recommended)</span>
                      <span className="pay-sub">
                        Pay ₹{tokenAmount} advance token online now to hold vehicle. Pay remaining ₹{remainingAtPickup} + security deposit at pickup counter.
                      </span>
                    </div>
                  </label>

                  <label className={`res-pay-card ${paymentMethod === 'online' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="payOpt" 
                      value="online" 
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                    />
                    <div>
                      <span className="pay-title">Pay Full Amount Online Now (Razorpay / Instant Confirmation)</span>
                      <span className="pay-sub">Pay full amount ₹{basePrice} online now for instant booking confirmation & priority pickup.</span>
                    </div>
                  </label>
                </div>

                {/* Price Calculation Card */}
                <div className="res-price-summary">
                  <div className="summary-row">
                    <span>Rental Rate ({rentalDays} {rentalDays === 1 ? 'day' : 'days'} × ₹{dailyRate}):</span>
                    <strong>₹{basePrice}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Refundable Security Deposit (at pickup):</span>
                    <span className="text-muted">₹{securityDeposit}</span>
                  </div>
                  {paymentMethod === 'pickup' && (
                    <div className="summary-row" style={{ color: '#ea580c', fontWeight: 600 }}>
                      <span>{isCar ? 'Car' : 'Bike'} Reservation Advance Token:</span>
                      <strong>₹{tokenAmount}</strong>
                    </div>
                  )}
                  {paymentMethod === 'pickup' && (
                    <div className="summary-row" style={{ color: '#0369a1' }}>
                      <span>Remaining Rent Balance at Counter:</span>
                      <strong>₹{remainingAtPickup}</strong>
                    </div>
                  )}
                  <div className="summary-row total-row">
                    <span>Total Rental Price:</span>
                    <strong className="total-amount">₹{basePrice}</strong>
                  </div>
                  <div className="summary-pay-now">
                    <span>Amount to pay online right now:</span>
                    <span className="pay-now-badge">₹{totalPayable}</span>
                  </div>
                </div>
              </div>

              {/* Checkbox Terms */}
              <div className="res-terms-field">
                <label className="checkbox-wrap">
                  <input 
                    type="checkbox" 
                    checked={agreedTerms} 
                    onChange={(e) => setAgreedTerms(e.target.checked)} 
                  />
                  <span>
                    I confirm that I hold a valid Driving License and agree to vahan.rentals <a href="/terms-and-conditions" target="_blank">Terms</a> & <a href="/cancellation-policy" target="_blank">Helmet Safety Policy</a>.
                  </span>
                </label>
                {errors.agreedTerms && <span className="err-msg" style={{ marginTop: 4 }}>{errors.agreedTerms}</span>}
              </div>

              {/* Submit Button to Email Verification */}
              <div className="res-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary res-submit-btn"
                >
                  <ShieldCheck size={18} />
                  Confirm & Register Reservation (₹{totalPayable} Online Now)
                  <ChevronRight size={18} />
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: Email Verification */}
          {currentStep === 'email_verify' && (
            <form className="res-form" onSubmit={handleVerifyEmailOtp}>
              <div className="res-form-section email-verify-card">
                <div className="step-header-icon">
                  <Mail size={32} className="text-primary" />
                </div>
                
                <h3 className="step-card-title">Verify Email Address</h3>
                <p className="step-card-sub">
                  Enter your email address to receive your official reservation voucher and instant 6-digit OTP.
                </p>

                <div className="res-field" style={{ marginBottom: '1.25rem' }}>
                  <label>Email Address <span className="req">*</span></label>
                  <div className="res-input-wrap">
                    <Mail size={16} className="res-input-icon" />
                    <input 
                      type="email" 
                      placeholder="e.g. rahul.sharma@gmail.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="res-otp-send-btn"
                      onClick={handleSendOtp}
                      disabled={isOtpSent && otpTimer > 0}
                    >
                      {isOtpSent ? (otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Resend OTP') : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {isOtpSent && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="otp-enter-box"
                  >
                    <div className="demo-otp-banner">
                      <Sparkles size={16} /> <span>Demo Verification Code: <strong>582914</strong></span>
                    </div>

                    <label>Enter 6-Digit Verification OTP Code</label>
                    <div className="res-input-wrap" style={{ marginTop: '6px' }}>
                      <Lock size={16} className="res-input-icon" />
                      <input 
                        type="text" 
                        placeholder="Enter OTP (e.g. 582914)" 
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{ letterSpacing: '4px', fontWeight: 800, fontSize: '1.1rem' }}
                      />
                    </div>
                  </motion.div>
                )}

                {otpError && <p className="err-msg" style={{ marginTop: '8px', textAlign: 'center' }}>{otpError}</p>}
              </div>

              <div className="res-step-buttons">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setCurrentStep('registration')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                {!isOtpSent ? (
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleSendOtp}
                    style={{ flex: 1 }}
                  >
                    Send Verification OTP <ChevronRight size={18} />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Verify Email & Proceed to Payment <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </form>
          )}

          {/* STEP 3: Payment Gateway */}
          {currentStep === 'payment' && (
            <form className="res-form" onSubmit={handleExecutePayment}>
              <div className="res-form-section payment-gateway-card">
                
                {/* Amount Header Banner */}
                <div className="pay-amount-banner">
                  <div>
                    <span className="banner-sub">Total Amount Payable Online Now</span>
                    <h3 className="banner-amount">₹{totalPayable}</h3>
                  </div>
                  <div className="banner-badge">
                    <ShieldCheck size={16} /> 256-Bit SSL Encrypted
                  </div>
                </div>

                {/* Payment Tabs */}
                <div className="pay-tabs-header">
                  <button 
                    type="button" 
                    className={`pay-tab ${payGatewayTab === 'upi' ? 'active' : ''}`}
                    onClick={() => setPayGatewayTab('upi')}
                  >
                    <QrCode size={16} /> UPI / QR Code
                  </button>
                  <button 
                    type="button" 
                    className={`pay-tab ${payGatewayTab === 'card' ? 'active' : ''}`}
                    onClick={() => setPayGatewayTab('card')}
                  >
                    <CreditCard size={16} /> Card
                  </button>
                  <button 
                    type="button" 
                    className={`pay-tab ${payGatewayTab === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setPayGatewayTab('netbanking')}
                  >
                    <Building2 size={16} /> Net Banking
                  </button>
                </div>

                {/* Tab 1: UPI / QR Code */}
                {payGatewayTab === 'upi' && (
                  <div className="pay-tab-body">
                    <div className="qr-pay-box">
                      <div className="qr-img-wrap">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=vahan.rentals@upi%26pn=VahanRentals%26am=${totalPayable}`} 
                          alt="Pay QR Code" 
                        />
                      </div>
                      <div className="qr-info">
                        <p className="qr-title">Scan QR Code using Google Pay, PhonePe, Paytm, BHIM</p>
                        <p className="qr-sub">Or enter your UPI ID below for instant payment request</p>
                        <div className="res-input-wrap" style={{ marginTop: '8px' }}>
                          <QrCode size={16} className="res-input-icon" />
                          <input 
                            type="text" 
                            placeholder="e.g. 9876543210@upi or rahul@okicici" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Credit / Debit Card */}
                {payGatewayTab === 'card' && (
                  <div className="pay-tab-body">
                    <div className="res-field" style={{ marginBottom: '10px' }}>
                      <label>Card Number</label>
                      <div className="res-input-wrap">
                        <CreditCard size={16} className="res-input-icon" />
                        <input 
                          type="text" 
                          placeholder="4532 •••• •••• 8921" 
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="res-input-grid">
                      <div className="res-field">
                        <label>Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          maxLength={5}
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          className="res-input-simple"
                        />
                      </div>
                      <div className="res-field">
                        <label>CVV / CVC</label>
                        <input 
                          type="password" 
                          placeholder="123" 
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="res-input-simple"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Net Banking */}
                {payGatewayTab === 'netbanking' && (
                  <div className="pay-tab-body">
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                      Select Your Bank
                    </label>
                    <div className="bank-select-grid">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                        <button 
                          key={bank}
                          type="button" 
                          className={`bank-btn ${selectedBank === bank ? 'selected' : ''}`}
                          onClick={() => setSelectedBank(bank)}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="res-step-buttons">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setCurrentStep('email_verify')}
                  disabled={isProcessingPayment}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <button 
                  type="submit" 
                  className="btn btn-primary pay-now-submit-btn"
                  disabled={isProcessingPayment}
                  style={{ flex: 1 }}
                >
                  {isProcessingPayment ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <RefreshCw size={18} className="spin-icon" /> Processing Secure Payment...
                    </span>
                  ) : (
                    <>
                      <Lock size={18} /> Pay ₹{totalPayable} Securely & Complete Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReservationModal;
