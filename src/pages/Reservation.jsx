import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, MapPin, User, Phone, FileCheck, ShieldCheck, 
  CreditCard, CheckCircle2, ChevronRight, UploadCloud, 
  Mail, Lock, QrCode, Building2, Sparkles, Check, Star,
  Info, AlertCircle, Clock, ShieldAlert, Award
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bikeData, carData, experienceData } from '../data';
import { saveBookingToDb } from '../services/supabaseService';
import './Reservation.css';

const Reservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Step state: 'registration' | 'email_verify' | 'payment' | 'confirmed'
  const [currentStep, setCurrentStep] = useState('registration');

  // Registration Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
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
  const [isKycVerified, setIsKycVerified] = useState(false);

  // Email Verification States
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

  // Final Confirmation State
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errors, setErrors] = useState({});

  // Find Vehicle Data
  useEffect(() => {
    window.scrollTo(0, 0);
    let found = bikeData.find(v => v.id === id) || 
                carData.find(v => v.id === id) || 
                experienceData.find(v => v.id === id);

    if (!found) {
      try {
        const adminFleets = JSON.parse(localStorage.getItem('vahan_admin_fleets') || '[]');
        found = adminFleets.find(v => v.id === id);
      } catch (e) {
        // ignore
      }
    }

    setVehicle(found);
    setLoading(false);

    // Initial search params
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');
    const locParam = searchParams.get('location');

    if (startParam && !isNaN(new Date(startParam).getTime())) {
      setStartDate(new Date(startParam));
    }
    if (endParam && !isNaN(new Date(endParam).getTime())) {
      setEndDate(new Date(endParam));
    }
    if (locParam) {
      setPickupLocation(locParam);
    } else if (found?.location) {
      setPickupLocation(found.location);
    }

    // Load saved user info
    const savedUser = localStorage.getItem('vahan_user_auth');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setFullName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.licenseNo) setLicenseNo(parsed.licenseNo);
        if (parsed.dlFile) setDlFile(parsed.dlFile);
        if (parsed.aadharFile) setAadharFile(parsed.aadharFile);
        if (parsed.verificationStatus === 'verified') setIsKycVerified(true);

        if (parsed.identifier) {
          if (parsed.identifier.includes('@')) {
            setEmail(parsed.identifier);
            if (!parsed.name) setFullName(parsed.identifier.split('@')[0]);
          } else {
            if (!parsed.phone) setPhone(parsed.identifier);
            if (!email) setEmail(`${parsed.identifier}@gmail.com`);
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }, [id, searchParams]);

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

  if (loading) {
    return (
      <div className="res-page-loading">
        <div className="res-spinner" />
        <p>Loading reservation details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="res-page-not-found">
        <h2>Vehicle Not Found</h2>
        <p>The vehicle you are trying to reserve is currently unavailable or doesn't exist.</p>
        <Link to="/bikes" className="btn btn-primary">Browse All Bikes</Link>
      </div>
    );
  }

  // Vehicle type & pricing logic
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

  const isExperienceService = (v) => {
    if (!v) return false;
    const idStr = (v.id || '').toLowerCase();
    const titleStr = (v.title || '').toLowerCase();
    const catStr = (v.category || '').toLowerCase();
    return (
      idStr === 'white-water-rafting' ||
      idStr === 'char-dham-taxi-service' ||
      idStr === 'bungee-jumping' ||
      titleStr.includes('rafting') ||
      titleStr.includes('char dham') ||
      titleStr.includes('bungee') ||
      catStr.includes('adventure') ||
      catStr.includes('pilgrimage') ||
      catStr.includes('extreme sport') ||
      catStr.includes('experience') ||
      v.type === 'Activity' ||
      v.itemType === 'Experience'
    );
  };

  const isCar = isCarVehicle(vehicle);
  const isExperience = isExperienceService(vehicle);
  const tokenAmount = isCar ? 500 : (isExperience ? 200 : 100);

  const getNumericPrice = (priceStr) => {
    if (!priceStr) return 800;
    if (typeof priceStr === 'number') return priceStr;
    const num = priceStr.replace(/[^0-9]/g, '');
    return num ? parseInt(num, 10) : 800;
  };

  const dailyRate = getNumericPrice(vehicle.price);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const rentalDays = calculateDays();
  const basePrice = dailyRate * rentalDays;
  const securityDeposit = isExperience ? 0 : 1000;

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

  const isValidEmail = (val) => {
    if (!val || typeof val !== 'string') return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(val.trim());
  };

  const validateRegistrationForm = () => {
    const errs = {};
    if (!email || !email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!isValidEmail(email)) {
      errs.email = 'Invalid email address (e.g. name@example.com)';
    }
    if (!fullName || !fullName.trim()) errs.fullName = 'Full Name is required';
    if (!phone || !phone.trim() || phone.trim().replace(/\D/g, '').length < 10) errs.phone = 'Valid 10-digit Mobile Number required';
    if (!isExperience && (!licenseNo || !licenseNo.trim())) {
      errs.licenseNo = 'Driving License / Govt ID number required';
    }
    if (!startDate) errs.startDate = 'Select start date';
    if (!endDate) errs.endDate = 'Select end date';
    if (!agreedTerms) errs.agreedTerms = isExperience ? 'You must accept booking terms & safety policy' : 'You must accept terms & helmet safety policy';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 1 -> Step 2
  const handleProceedToEmailVerification = (e) => {
    e.preventDefault();
    if (!validateRegistrationForm()) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep('email_verify');
  };

  // Send OTP
  const handleSendOtp = () => {
    if (!email || !email.trim()) {
      setOtpError('Email Address is required');
      return;
    }
    if (!isValidEmail(email)) {
      setOtpError('Invalid email address (e.g. name@example.com)');
      return;
    }
    setOtpError('');
    setIsOtpSent(true);
    setOtpTimer(30);
    setOtp('582914'); // Pre-fill demo OTP code
  };

  // Step 2 -> Step 3
  const handleVerifyEmailOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      setOtpError('Please enter 6-digit OTP code sent to your email');
      return;
    }
    setOtpError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep('payment');
  };

  // Step 3 -> Final Payment Execution
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
      category: isCar ? 'Car / Cab' : (isExperience ? 'Experience / Service' : 'Bike / Scooty'),
      isCar,
      isExperience,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      licenseNo: licenseNo.trim(),
      dlFileName: dlFile ? dlFile.name : 'Attached at Counter',
      dlFileUrl: dlFile ? dlFile.url : null,
      aadharFileName: aadharFile ? aadharFile.name : 'Attached at Counter',
      aadharFileUrl: aadharFile ? aadharFile.url : null,
      pickupLocation,
      hostName: vehicle.hostedBy || 'vahan.rentals',
      hostPhone: vehicle.hostPhone || vehicle.phone || '+91 7060512661',
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

      // Save to Supabase Database
      saveBookingToDb(reservationData).catch(e => console.warn('Supabase save error:', e));

      // Save into admin & user localStorage bookings for instant offline sync
      try {
        const existingBookings = JSON.parse(localStorage.getItem('vahan_admin_bookings') || '[]');
        localStorage.setItem('vahan_admin_bookings', JSON.stringify([reservationData, ...existingBookings]));

        const userBookings = JSON.parse(localStorage.getItem('vahan_user_bookings') || '[]');
        localStorage.setItem('vahan_user_bookings', JSON.stringify([reservationData, ...userBookings]));
      } catch (err) {
        console.error(err);
      }

      setConfirmedBooking(reservationData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep('confirmed');
    }, 1200);
  };

  return (
    <div className="reservation-page">
      <div className="container">
        
        {/* Top Navigation & Breadcrumbs */}
        <div className="res-top-nav">
          <button 
            type="button" 
            className="res-back-btn" 
            onClick={() => navigate(`/vehicle/${vehicle.id}`)}
          >
            <ArrowLeft size={16} /> Back to Vehicle Details
          </button>
          
          <div className="res-top-badge">
            <ShieldCheck size={14} /> Official Verified Booking
          </div>
        </div>

        {/* Header Title Section */}
        <div className="res-page-header">
          <span className="res-official-pill">vahan.rentals • Official Reservation</span>
          <h1 className="res-main-heading">
            {currentStep === 'registration' && 'Complete Registration Details'}
            {currentStep === 'email_verify' && 'Email Address Verification'}
            {currentStep === 'payment' && 'Secure Payment Gateway'}
            {currentStep === 'confirmed' && 'Reservation Confirmed!'}
          </h1>
          <p className="res-main-sub">
            {currentStep === 'registration' && 'Enter details & schedule your pickup.'}
            {currentStep === 'email_verify' && 'Verify email to receive your booking voucher.'}
            {currentStep === 'payment' && 'Pay token advance to confirm reservation.'}
            {currentStep === 'confirmed' && 'Your vehicle is officially reserved.'}
          </p>
        </div>

        {/* Steps Progress Indicator Bar */}
        <div className="res-page-steps">
          <div className={`page-step-item ${currentStep === 'registration' ? 'active' : 'completed'}`}>
            <span className="step-circle">{currentStep !== 'registration' ? <Check size={14} /> : '1'}</span>
            <span className="step-label">1. Details & KYC</span>
          </div>
          <div className={`step-connector ${currentStep !== 'registration' ? 'active' : ''}`} />
          
          <div className={`page-step-item ${currentStep === 'email_verify' ? 'active' : (currentStep === 'payment' || currentStep === 'confirmed') ? 'completed' : ''}`}>
            <span className="step-circle">{(currentStep === 'payment' || currentStep === 'confirmed') ? <Check size={14} /> : '2'}</span>
            <span className="step-label">2. Email OTP</span>
          </div>
          <div className={`step-connector ${(currentStep === 'payment' || currentStep === 'confirmed') ? 'active' : ''}`} />
          
          <div className={`page-step-item ${currentStep === 'payment' ? 'active' : currentStep === 'confirmed' ? 'completed' : ''}`}>
            <span className="step-circle">{currentStep === 'confirmed' ? <Check size={14} /> : '3'}</span>
            <span className="step-label">3. Payment</span>
          </div>
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="res-page-grid">
          
          {/* Left Column: Interactive Steps */}
          <div className="res-page-main">
            
            {/* STEP 1: Registration Form */}
            {currentStep === 'registration' && (
              <motion.form 
                className="res-card-box"
                onSubmit={handleProceedToEmailVerification}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Section 1: Renter Details */}
                <div className="res-form-block">
                  <h3 className="block-title">
                    <User size={18} className="text-primary" /> Primary Renter Details & Verification
                  </h3>

                  {/* Email Address (First Field) */}
                  <div className="res-field" style={{ marginBottom: '1rem' }}>
                    <label>Email Address <span className="req">*</span></label>
                    <div className="res-input-wrap">
                      <Mail size={16} className="res-input-icon" />
                      <input 
                        type="email" 
                        placeholder="e.g. rahul.sharma@gmail.com" 
                        value={email}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEmail(val);
                          if (errors.email) {
                            if (isValidEmail(val)) {
                              setErrors(prev => ({ ...prev, email: null }));
                            }
                          }
                        }}
                        onBlur={() => {
                          if (email && !isValidEmail(email)) {
                            setErrors(prev => ({ ...prev, email: 'Invalid email address (e.g. name@example.com)' }));
                          }
                        }}
                        className={errors.email ? 'error' : ''}
                      />
                    </div>
                    {errors.email && <span className="err-msg">{errors.email}</span>}
                  </div>

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
                          maxLength={10}
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          value={phone}
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setPhone(digitsOnly);
                            if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                          }}
                          className={errors.phone ? 'error' : ''}
                        />
                      </div>
                      {errors.phone && <span className="err-msg">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Driving License / Govt ID (Only for Vehicles/Bikes/Cars, not for Experiences) */}
                  {!isExperience && (
                    <div className="res-field" style={{ marginTop: '1rem' }}>
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
                  )}

                  {/* Document Upload Area (Only for Vehicles/Bikes/Cars, not for Experiences) */}
                  {!isExperience && (
                    isKycVerified ? (
                      <div className="kyc-verified-box">
                        <Sparkles size={20} className="text-success" />
                        <div>
                          <strong>⚡ KYC PRE-VERIFIED RENTER (EXPRESS CHECKOUT)</strong>
                          <p>Your driving license & identity are verified by Admin. Document upload skipped for fast checkout!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="res-upload-box">
                        <h4 className="upload-box-title">
                          <UploadCloud size={16} className="text-primary" /> Upload ID Verification Documents
                        </h4>
                        <p className="upload-box-sub">
                          Upload Driving License and Aadhar/Passport photo for smooth pickup. (Optional now, can also be shown at pickup counter).
                        </p>

                        <div className="res-upload-grid">
                          <div className={`res-upload-slot ${dlFile ? 'has-file' : ''}`}>
                            <label className="upload-label">
                              <input type="file" accept="image/*,.pdf" onChange={handleDlUpload} />
                              <div className="upload-content">
                                <UploadCloud size={24} className="upload-icon" />
                                <span className="upload-main-text">{dlFile ? 'Driving License Uploaded' : 'Upload Driving License'}</span>
                                <span className="upload-hint">{dlFile ? dlFile.name : 'JPG, PNG, PDF'}</span>
                              </div>
                            </label>
                            {dlFile && (
                              <button type="button" className="remove-file-btn" onClick={() => setDlFile(null)}>✕ Remove</button>
                            )}
                          </div>

                          <div className={`res-upload-slot ${aadharFile ? 'has-file' : ''}`}>
                            <label className="upload-label">
                              <input type="file" accept="image/*,.pdf" onChange={handleAadharUpload} />
                              <div className="upload-content">
                                <UploadCloud size={24} className="upload-icon" />
                                <span className="upload-main-text">{aadharFile ? 'Aadhar Card Uploaded' : 'Upload Aadhar Card'}</span>
                                <span className="upload-hint">{aadharFile ? aadharFile.name : 'JPG, PNG, PDF'}</span>
                              </div>
                            </label>
                            {aadharFile && (
                              <button type="button" className="remove-file-btn" onClick={() => setAadharFile(null)}>✕ Remove</button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Section 2: Schedule & Pickup */}
                <div className="res-form-block">
                  <h3 className="block-title">
                    <Calendar size={18} className="text-primary" /> Schedule & Pickup Location
                  </h3>

                  <div className="res-input-grid">
                    <div className="res-field">
                      <label>Start Date <span className="req">*</span></label>
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
                      <label>End Date <span className="req">*</span></label>
                      <div className="res-input-wrap">
                        <Calendar size={16} className="res-input-icon" />
                        <DatePicker 
                          selected={endDate} 
                          onChange={(d) => setEndDate(d)} 
                          minDate={startDate || new Date()}
                          dateFormat="dd MMM yyyy"
                          className="res-datepicker-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="res-field" style={{ marginTop: '1rem' }}>
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

                {/* Section 3: Payment Preference */}
                <div className="res-form-block">
                  <h3 className="block-title">
                    <CreditCard size={18} className="text-primary" /> Payment Preference & Advance Token
                  </h3>

                  <div className="res-payment-cards">
                    <label className={`payment-card-opt ${paymentMethod === 'pickup' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="payOpt" 
                        value="pickup" 
                        checked={paymentMethod === 'pickup'}
                        onChange={() => setPaymentMethod('pickup')}
                      />
                      <div className="opt-body">
                        <div className="opt-title-row">
                          <span className="opt-title">Pay at Pickup Counter (Recommended)</span>
                          <span className="opt-badge">Low Risk</span>
                        </div>
                        <p className="opt-sub">
                          Pay ₹{tokenAmount} advance token online now to hold your vehicle. Pay remaining ₹{remainingAtPickup} + security deposit at pickup counter.
                        </p>
                      </div>
                    </label>

                    <label className={`payment-card-opt ${paymentMethod === 'online' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="payOpt" 
                        value="online" 
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                      />
                      <div className="opt-body">
                        <div className="opt-title-row">
                          <span className="opt-title">Pay Full Amount Online (Express Direct Pickup)</span>
                          <span className="opt-badge express">Fast Key Handover</span>
                        </div>
                        <p className="opt-sub">
                          Pay total ₹{basePrice} online now. Zero payment hassle at counter, just grab helmet and keys!
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="res-terms-box">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={agreedTerms} 
                      onChange={(e) => setAgreedTerms(e.target.checked)} 
                    />
                    <span>
                      I confirm that I hold a valid Driving License and agree to vahan.rentals <Link to="/terms-and-conditions" target="_blank">Terms</Link> & <Link to="/cancellation-policy" target="_blank">Helmet Safety Policy</Link>.
                    </span>
                  </label>
                  {errors.agreedTerms && <span className="err-msg">{errors.agreedTerms}</span>}
                </div>

                {/* Submit CTA */}
                <div className="res-cta-action">
                  <button type="submit" className="btn btn-primary res-page-submit-btn">
                    <ShieldCheck size={20} />
                    <span>Proceed to Email Verification & Token (₹{totalPayable} Online Now)</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 2: Email Verification */}
            {currentStep === 'email_verify' && (
              <motion.form 
                className="res-card-box email-verify-card"
                onSubmit={handleVerifyEmailOtp}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="step-center-icon">
                  <Mail size={36} className="text-primary" />
                </div>
                
                <h3 className="step-verify-title">Verify Email Address</h3>
                <p className="step-verify-sub">
                  We send your official reservation voucher and instant booking receipt to your email address.
                </p>

                <div className="res-field" style={{ maxWidth: '440px', margin: '0 auto 1.5rem' }}>
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
                    className="otp-enter-panel"
                  >
                    <div className="demo-otp-tag">
                      <Sparkles size={16} /> <span>Demo Verification Code: <strong>582914</strong></span>
                    </div>

                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Enter 6-Digit Verification OTP Code
                    </label>
                    <div className="res-input-wrap" style={{ maxWidth: '300px', margin: '0 auto' }}>
                      <Lock size={16} className="res-input-icon" />
                      <input 
                        type="text" 
                        placeholder="582914" 
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{ letterSpacing: '4px', fontWeight: 800, fontSize: '1.2rem', textAlign: 'center' }}
                      />
                    </div>
                  </motion.div>
                )}

                {otpError && <p className="err-msg" style={{ textAlign: 'center', marginTop: '10px' }}>{otpError}</p>}

                <div className="step-actions-row">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setCurrentStep('registration')}
                  >
                    <ArrowLeft size={16} /> Back to Details
                  </button>

                  {!isOtpSent ? (
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleSendOtp}
                    >
                      Send Verification OTP
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      Verify & Proceed to Payment <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </motion.form>
            )}

            {/* STEP 3: Payment Gateway */}
            {currentStep === 'payment' && (
              <motion.form 
                className="res-card-box"
                onSubmit={handleExecutePayment}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="pay-header-banner">
                  <div className="pay-amount-box">
                    <span>Payable Online Right Now</span>
                    <h2>₹{totalPayable}</h2>
                    <span className="pay-tag">{paymentMethod === 'pickup' ? `Token Deposit (₹${remainingAtPickup} at counter)` : 'Full Payment Online'}</span>
                  </div>
                  <div className="pay-security-shield">
                    <ShieldCheck size={28} />
                    <span>256-Bit SSL Encrypted Mock Gateway</span>
                  </div>
                </div>

                <div className="pay-methods-tabs">
                  <button 
                    type="button" 
                    className={`pay-tab-btn ${payGatewayTab === 'upi' ? 'active' : ''}`}
                    onClick={() => setPayGatewayTab('upi')}
                  >
                    <QrCode size={16} /> UPI & QR Code
                  </button>
                  <button 
                    type="button" 
                    className={`pay-tab-btn ${payGatewayTab === 'card' ? 'active' : ''}`}
                    onClick={() => setPayGatewayTab('card')}
                  >
                    <CreditCard size={16} /> Debit / Credit Card
                  </button>
                  <button 
                    type="button" 
                    className={`pay-tab-btn ${payGatewayTab === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setPayGatewayTab('netbanking')}
                  >
                    <Building2 size={16} /> Net Banking
                  </button>
                </div>

                {/* Tab: UPI */}
                {payGatewayTab === 'upi' && (
                  <div className="pay-tab-content">
                    <div className="upi-qr-display">
                      <div className="qr-wrapper">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=vahanrentals@okhdfcbank%26pn=Vahan%20Rentals%26am=${totalPayable}%26cu=INR`} 
                          alt="Scan to Pay QR"
                        />
                        <span className="qr-scan-badge">Scan with GPay / PhonePe / Paytm</span>
                      </div>
                      <div className="upi-id-box">
                        <label>Or enter UPI ID / VPA</label>
                        <input 
                          type="text" 
                          placeholder="e.g. yourname@oksbi" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                        <p className="upi-hint">Instant reservation confirmation upon approval</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Card */}
                {payGatewayTab === 'card' && (
                  <div className="pay-tab-content card-fields">
                    <div className="res-field">
                      <label>Card Number</label>
                      <input 
                        type="text" 
                        placeholder="4532 •••• •••• 8921" 
                        value={cardNumber}
                        maxLength={19}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="res-input-grid" style={{ marginTop: '10px' }}>
                      <div className="res-field">
                        <label>Expiry (MM/YY)</label>
                        <input 
                          type="text" 
                          placeholder="12/28" 
                          value={cardExp}
                          maxLength={5}
                          onChange={(e) => setCardExp(e.target.value)}
                        />
                      </div>
                      <div className="res-field">
                        <label>CVV</label>
                        <input 
                          type="password" 
                          placeholder="•••" 
                          value={cardCvv}
                          maxLength={4}
                          onChange={(e) => setCardCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Net Banking */}
                {payGatewayTab === 'netbanking' && (
                  <div className="pay-tab-content">
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                      Select Your Bank
                    </label>
                    <div className="bank-select-grid">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                        <button 
                          key={b}
                          type="button" 
                          className={`bank-btn ${selectedBank === b ? 'selected' : ''}`}
                          onClick={() => setSelectedBank(b)}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="step-actions-row">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setCurrentStep('email_verify')}
                    disabled={isProcessingPayment}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button 
                    type="submit" 
                    className="btn btn-primary pay-now-btn"
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="res-btn-spinner" />
                        <span>Processing ₹{totalPayable}...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        <span>Pay ₹{totalPayable} & Confirm Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 4: Confirmed Receipt */}
            {currentStep === 'confirmed' && confirmedBooking && (
              <motion.div 
                className="res-card-box confirmed-box"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="confirmed-header">
                  <div className="success-circle">
                    <Check size={40} />
                  </div>
                  <h2>Official Reservation Confirmed!</h2>
                  <p className="booking-ref-line">
                    Booking Reference ID: <strong>{confirmedBooking.bookingId}</strong>
                  </p>
                  <p className="booking-status-chip">⚡ Token Advance Paid Online</p>
                </div>

                <div className="voucher-receipt-card">
                  <div className="voucher-head">
                    <div>
                      <h3>{confirmedBooking.vehicleTitle}</h3>
                      <span className="voucher-cat-pill">{confirmedBooking.category}</span>
                    </div>
                    <span className="voucher-price">₹{confirmedBooking.dailyRate}/day</span>
                  </div>

                  <div className="voucher-details-grid">
                    <div className="v-row">
                      <span>Renter Name:</span>
                      <strong>{confirmedBooking.fullName}</strong>
                    </div>
                    <div className="v-row">
                      <span>Contact Phone:</span>
                      <strong>{confirmedBooking.phone}</strong>
                    </div>
                    <div className="v-row">
                      <span>Email Voucher Sent:</span>
                      <strong>{confirmedBooking.email}</strong>
                    </div>
                    {!confirmedBooking.isExperience && confirmedBooking.licenseNo && (
                      <div className="v-row">
                        <span>Driving License / ID:</span>
                        <strong>{confirmedBooking.licenseNo}</strong>
                      </div>
                    )}
                    <div className="v-divider" />
                    <div className="v-row">
                      <span>Pickup Hub Location:</span>
                      <strong>{confirmedBooking.pickupLocation}</strong>
                    </div>
                    <div className="v-row">
                      <span>Rental Dates:</span>
                      <strong>{confirmedBooking.formattedStartDate} to {confirmedBooking.formattedEndDate} ({confirmedBooking.rentalDays} Days)</strong>
                    </div>
                    <div className="v-row">
                      <span>Host / Desk Contact:</span>
                      <strong style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} /> {confirmedBooking.hostPhone || '+91 7060512661'}
                      </strong>
                    </div>
                    <div className="v-divider" />
                    <div className="v-row total">
                      <span>Total Rental Fare:</span>
                      <strong>₹{confirmedBooking.totalAmount}</strong>
                    </div>
                    <div className="v-row paid">
                      <span>Online Token Paid:</span>
                      <strong className="text-success">₹{confirmedBooking.totalAmountToPayNow}</strong>
                    </div>
                    {confirmedBooking.paymentMethod === 'pickup' && (
                      <div className="v-row due">
                        <span>Balance Due at Pickup:</span>
                        <strong className="text-warning">₹{confirmedBooking.remainingAmountAtPickup}</strong>
                      </div>
                    )}
                  </div>

                  <div className="voucher-pickup-guide">
                    <Info size={18} className="text-primary" />
                    <p>
                      {confirmedBooking.isExperience ? (
                        <>Please present your <strong>Booking Confirmation Voucher / WhatsApp Slip</strong> at the reporting counter in {confirmedBooking.pickupLocation}.</>
                      ) : (
                        <>Please bring your original <strong>Driving License</strong> and <strong>Govt ID (Aadhar/Passport)</strong> at vehicle handover counter in {confirmedBooking.pickupLocation}.</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="voucher-action-btns">
                  <a 
                    href={`https://wa.me/917060512661?text=${encodeURIComponent(`Hi Vahan Rentals, I have registered booking ${confirmedBooking.bookingId} for ${confirmedBooking.vehicleTitle} (${confirmedBooking.formattedStartDate} to ${confirmedBooking.formattedEndDate}). Please confirm pickup details.`)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn whatsapp-share-btn"
                  >
                    💬 Get Instant Slip on WhatsApp
                  </a>

                  <Link to="/" className="btn btn-outline">
                    Back to Home
                  </Link>
                </div>
              </motion.div>
            )}

          </div>

          {/* Right Column: Sticky Vehicle & Fare Summary */}
          <div className="res-page-sidebar">
            <div className="res-summary-card">
              <div className="summary-thumb-box">
                <img src={vehicle.image} alt={vehicle.title} className="summary-thumb-img" />
                <span className="summary-cat-badge">{isCar ? '🚗 Car Fleet' : '🛵 Bike / Scooty'}</span>
              </div>

              <div className="summary-body">
                <h3 className="summary-vehicle-title">{vehicle.title}</h3>
                <div className="summary-meta-row">
                  <span className="summary-location">
                    <MapPin size={14} /> {pickupLocation || vehicle.location}
                  </span>
                  <span className="summary-rating">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {vehicle.rating || '4.8'}
                  </span>
                </div>

                <div className="summary-divider" />

                {/* Rental Duration */}
                <div className="summary-duration-box">
                  <div className="duration-item">
                    <span className="d-label">START DATE</span>
                    <span className="d-val">{startDate ? startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select'}</span>
                  </div>
                  <div className="duration-arrow">→</div>
                  <div className="duration-item">
                    <span className="d-label">END DATE</span>
                    <span className="d-val">{endDate ? endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select'}</span>
                  </div>
                </div>

                <div className="summary-divider" />

                {/* Price Breakdown */}
                <div className="summary-price-table">
                  <div className="price-row">
                    <span>Daily Rate</span>
                    <span>₹{dailyRate} / day</span>
                  </div>
                  <div className="price-row">
                    <span>Rental Duration</span>
                    <span>{rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}</span>
                  </div>
                  <div className="price-row total-calc">
                    <span>Total Rental Fare</span>
                    <span className="bold-price">₹{basePrice}</span>
                  </div>
                  <div className="summary-divider dashed" />
                  <div className="price-row token-row">
                    <span>Pay Online Token Now:</span>
                    <span className="token-amount">₹{totalPayable}</span>
                  </div>
                  {paymentMethod === 'pickup' && (
                    <div className="price-row pickup-rem-row">
                      <span>Payable at Pickup Counter:</span>
                      <span className="pickup-amount">₹{remainingAtPickup}</span>
                    </div>
                  )}
                  <div className="price-row sec-dep-row">
                    <span>Security Deposit (Refundable at return):</span>
                    <span>₹{securityDeposit}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="summary-trust-badges">
                  <div className="trust-item">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Free cancellation before 24 hrs</span>
                  </div>
                  <div className="trust-item">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Complimentary ISI Clean Helmets</span>
                  </div>
                  <div className="trust-item">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>24/7 Roadside Assistance in Hills</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Reservation;
