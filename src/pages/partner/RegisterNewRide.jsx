import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Plus, CheckCircle2, Upload, Wallet, ChevronDown,
  Bike, Car, MapPin, ShieldCheck, FileText, Phone, Mail, User, AlertCircle,
  LayoutDashboard, Calendar, Settings, Sparkles, ArrowUpRight, ChevronLeft, ChevronRight,
  Handshake, LogOut
} from 'lucide-react';
import { getPartnerFleet, savePartnerFleet, getPartnerBookings, savePartnerBookings } from './partnerData';
import './PartnerDashboard.css';
import './RegisterNewRide.css';

const RegisterNewRide = () => {
  const navigate = useNavigate();
  const [fleet, setFleet] = useState(getPartnerFleet());
  const [bookings, setBookings] = useState(getPartnerBookings());
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sidebar States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHindiLang, setIsHindiLang] = useState(false);

  // Host Profile
  const hostProfile = {
    name: 'Himalayan Fleet Host',
    phone: '+91 70605 12661',
    hubLocation: 'Laxman Jhula Main Road, Tapovan Rishikesh',
    logo: ''
  };

  // Calculate Partner Monthly Earnings
  const totalPartnerEarnings = bookings.reduce((sum, b) => sum + (b.totalFare || 0), 0);

  // Initialize ride form with live current date/time + 24 hours
  const [newRide, setNewRide] = useState(() => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const pickupNow = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
    const return24h = new Date(now.getTime() + (24 * 60 * 60 * 1000) - tzOffset).toISOString().slice(0, 16);

    const availableFleet = getPartnerFleet().filter(f => f.status === 'Available');
    const firstAvailable = availableFleet[0] || getPartnerFleet()[0];

    return {
      riderEmail: '',
      riderName: '',
      gender: 'Male',
      riderPhone: '',
      dlNumber: '',
      riderIdPhoto: '',
      vehicleId: firstAvailable ? firstAvailable.id : '',
      pickupDate: pickupNow,
      returnDate: return24h,
      paymentStatus: '🟢 UPI Paid',
      amountReceived: '',
      securityDeposit: '2000',
      isPaymentConfirmed: true
    };
  });

  useEffect(() => {
    const currentFleet = getPartnerFleet();
    const currentBookings = getPartnerBookings();
    setFleet(currentFleet);
    setBookings(currentBookings);
    const selV = currentFleet.find(f => f.id === newRide.vehicleId);
    if (selV) {
      setVehicleSearchQuery(`${selV.title} - ${selV.regNo}`);
    }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRiderIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRide(prev => ({ ...prev, riderIdPhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterNewRide = (e) => {
    e.preventDefault();

    if (!newRide.riderEmail || !newRide.riderName || !newRide.riderPhone || !newRide.dlNumber || !newRide.riderIdPhoto) {
      showToast('Please complete all mandatory fields (*), including Email Address & Document Upload.', 'error');
      return;
    }

    if (newRide.riderPhone.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    const selectedV = fleet.find(f => f.id === newRide.vehicleId) || fleet[0];

    // Dynamic days computation based on pickup and return dates
    let calcDays = 1;
    if (newRide.pickupDate && newRide.returnDate) {
      const pMs = new Date(newRide.pickupDate).getTime();
      const rMs = new Date(newRide.returnDate).getTime();
      if (!isNaN(pMs) && !isNaN(rMs) && rMs > pMs) {
        const diffMs = rMs - pMs;
        calcDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      }
    }

    const dailyRate = selectedV.price || 1500;
    const computedTotalFare = calcDays * dailyRate;
    const computedPartnerShare = Math.round(computedTotalFare * 0.85);
    const finalReceivedAmount = newRide.amountReceived !== '' && newRide.amountReceived !== undefined
      ? parseInt(newRide.amountReceived)
      : computedTotalFare;

    const newBookingId = `VR-${Math.floor(8800 + Math.random() * 1000)}`;

    const createdBooking = {
      bookingId: newBookingId,
      vehicle: selectedV.title,
      regNo: selectedV.regNo,
      renter: newRide.riderName,
      email: newRide.riderEmail,
      phone: newRide.riderPhone,
      dlNumber: newRide.dlNumber,
      riderIdPhoto: newRide.riderIdPhoto,
      dateCreated: new Date().toISOString().slice(0, 10),
      dates: `${newRide.pickupDate.replace('T', ' ')} - ${newRide.returnDate.replace('T', ' ')}`,
      pickupTime: newRide.pickupDate.replace('T', ' '),
      returnTime: newRide.returnDate.replace('T', ' '),
      bookingMethod: 'Walk-in Entry',
      totalFare: computedTotalFare,
      partnerShare: computedPartnerShare,
      status: 'Active Trip',
      pickup: selectedV.location,
      paymentStatus: `${newRide.paymentStatus || '🟢 UPI Paid'} (Received: ₹${finalReceivedAmount.toLocaleString()})`,
      deposit: newRide.securityDeposit ? `₹${parseInt(newRide.securityDeposit).toLocaleString()}` : '₹2,000'
    };

    // Save into LocalStorage Bookings
    const existingBookings = getPartnerBookings();
    const updatedBookings = [createdBooking, ...existingBookings];
    savePartnerBookings(updatedBookings);

    // Update fleet vehicle status to 'Rented'
    const updatedFleet = fleet.map(v => {
      if (v.id === selectedV.id) {
        return {
          ...v,
          status: 'Rented',
          totalTrips: (v.totalTrips || 0) + 1,
          totalEarnings: (v.totalEarnings || 0) + computedPartnerShare
        };
      }
      return v;
    });
    savePartnerFleet(updatedFleet);

    showToast(`✅ New Ride Registered & Assigned! (Booking ID: ${newBookingId})`);

    setTimeout(() => {
      navigate('/partner/dashboard');
    }, 1200);
  };

  const selectedVehicle = fleet.find(f => f.id === newRide.vehicleId) || fleet[0];
  const dailyRate = selectedVehicle ? (selectedVehicle.price || 1500) : 1500;
  
  let daysCount = 1;
  if (newRide.pickupDate && newRide.returnDate) {
    const pMs = new Date(newRide.pickupDate).getTime();
    const rMs = new Date(newRide.returnDate).getTime();
    if (!isNaN(pMs) && !isNaN(rMs) && rMs > pMs) {
      const diffMs = rMs - pMs;
      daysCount = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }
  }
  const totalRentalFare = daysCount * dailyRate;
  const hostShare = Math.round(totalRentalFare * 0.85);

  return (
    <div className="partner-dashboard-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`new-ride-toast ${toastMessage.type}`}>
          {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="partner-header">
        <div className="partner-header-left">
          <Link to="/" className="partner-dash-brand">
            Vahan<span>.Rentals</span>
          </Link>
          <span className="partner-host-pill">
            <Handshake size={14} /> HOST PORTAL
          </span>
          <span className="partner-location-pill">
            <MapPin size={13} color="#059669" /> Tapovan Rishikesh Hub
          </span>
        </div>

        <div className="partner-header-right">
          <div className="partner-payout-balance-box">
            <Wallet size={18} className="text-emerald" />
            <div>
              <span className="payout-label">Monthly Payout</span>
              <strong className="payout-amount">₹{(totalPartnerEarnings * 0.85).toLocaleString()}</strong>
            </div>
          </div>

          <button
            className="btn-exit-partner"
            onClick={() => navigate('/partner/dashboard')}
            title="Back to Dashboard"
            style={{ color: '#0f172a', borderColor: '#cbd5e1', background: '#f8fafc' }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Body Grid with Sidebar */}
      <div className={`partner-dash-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Sidebar Nav (Desktop) */}
        <aside className={`partner-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="partner-sidebar-scroll">
            <div
              className="partner-user-badge-card"
              title={isSidebarCollapsed ? `${hostProfile.name} • Verified Host` : undefined}
            >
              <div className="partner-avatar-circle" style={{ overflow: 'hidden', padding: 0 }}>
                {hostProfile.logo ? (
                  <img
                    src={hostProfile.logo}
                    alt="Host Profile Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  hostProfile.name ? hostProfile.name.charAt(0).toUpperCase() : 'H'
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="partner-user-info-text">
                  <h4 className="partner-host-name">{hostProfile.name}</h4>
                  <p className="partner-host-id">ID: H-88210 • Verified Host</p>
                </div>
              )}
            </div>

            <nav className="partner-nav-menu">
              <button
                className="partner-nav-btn"
                onClick={() => navigate('/partner/dashboard', { state: { activeTab: 'overview' } })}
                title="Host Overview"
              >
                <span className="partner-nav-icon"><LayoutDashboard size={19} /></span>
                {!isSidebarCollapsed && <span className="partner-nav-label">Host Overview</span>}
              </button>

              <button
                className="partner-nav-btn"
                onClick={() => navigate('/partner/dashboard', { state: { activeTab: 'fleet' } })}
                title={`Listed Vehicles (${fleet.length})`}
              >
                <span className="partner-nav-icon"><Bike size={19} /></span>
                {!isSidebarCollapsed && (
                  <span className="partner-nav-label">
                    Listed Vehicles ({fleet.length})
                  </span>
                )}
              </button>

              <button
                className="partner-nav-btn"
                onClick={() => navigate('/partner/dashboard', { state: { activeTab: 'bookings' } })}
                title={`Live Reservations (${bookings.length})`}
              >
                <span className="partner-nav-icon"><Calendar size={19} /></span>
                {!isSidebarCollapsed && (
                  <span className="partner-nav-label">
                    Live Reservations ({bookings.length})
                  </span>
                )}
              </button>

              <button
                className="partner-nav-btn"
                onClick={() => navigate('/partner/dashboard', { state: { activeTab: 'payouts' } })}
                title="Earnings & Payouts"
              >
                <span className="partner-nav-icon"><Wallet size={19} /></span>
                {!isSidebarCollapsed && <span className="partner-nav-label">Earnings & Payouts</span>}
              </button>

              <button
                className="partner-nav-btn"
                onClick={() => navigate('/partner/dashboard', { state: { activeTab: 'settings' } })}
                title="Host Settings & KYC"
              >
                <span className="partner-nav-icon"><Settings size={19} /></span>
                {!isSidebarCollapsed && <span className="partner-nav-label">Host Settings & KYC</span>}
              </button>
            </nav>

            {!isSidebarCollapsed && (
              <div className="partner-sidebar-promo">
                <Sparkles size={20} className="promo-sparkle" />
                <h5>Need Fleet Financing?</h5>
                <p>Expand your bike or car fleet with 0% commission partner loans.</p>
                <a href="https://wa.me/917060512661" target="_blank" rel="noopener noreferrer" className="promo-link">
                  Contact Desk <ArrowUpRight size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Bottom Controls Area (Language Toggle, Profile, Collapse Toggle) */}
          <div className="partner-sidebar-footer">
            {/* Language Switch */}
            <div
              className={`partner-sidebar-lang-toggle ${isSidebarCollapsed ? 'collapsed' : ''}`}
              onClick={() => setIsHindiLang(!isHindiLang)}
              title={isHindiLang ? "Language: Hindi" : "Language: English"}
            >
              <div className={`partner-toggle-switch ${isHindiLang ? 'active' : ''}`}>
                <div className="partner-toggle-thumb"></div>
              </div>
              {!isSidebarCollapsed && <span className="partner-lang-label">Hindi</span>}
            </div>

            {/* User Profile Bar */}
            <div
              className={`partner-sidebar-user-row ${isSidebarCollapsed ? 'collapsed' : ''}`}
              onClick={() => navigate('/partner/dashboard', { state: { activeTab: 'settings' } })}
              title={hostProfile.name || "VIKIRANJAN KUMAR"}
            >
              <div className="partner-sidebar-user-avatar">
                <User size={18} />
              </div>
              {!isSidebarCollapsed && (
                <>
                  <span className="partner-sidebar-user-name">
                    {hostProfile.name?.toUpperCase() || 'VIKIRANJAN KUMAR'}
                  </span>
                  <ChevronRight size={16} className="partner-user-chevron" />
                </>
              )}
            </div>

            {/* Collapse / Expand Toggle Button Bar */}
            <button
              className="partner-sidebar-collapse-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
              aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="partner-content-area new-ride-main-scroll">
          <div className="new-ride-container-fluid">
            <motion.div 
              className="new-ride-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="new-ride-title-banner">
                <div>
                  <h1 className="new-ride-main-title">
                    Register New Rider & Walk-in Ride Entry
                  </h1>
                  <p className="new-ride-main-subtitle">
                    Register counter walk-in customers, record driving license verification, and assign instant fleet vehicle bookings.
                  </p>
                </div>
                <div className="new-ride-tag-box">
                  <ShieldCheck size={20} color="#059669" />
                  <span>Instant Verification</span>
                </div>
              </div>

              <form onSubmit={handleRegisterNewRide} className="new-ride-form">
                {/* SECTION 1: RENTER IDENTITY VERIFICATION */}
                <div className="form-section-box">
                  <h3 className="form-section-title">
                    <span className="section-step-badge">SECTION 1</span>
                    Renter / Customer Identity Verification
                  </h3>

                  {/* Email Field */}
                  <div className="field-group full-width">
                    <label>EMAIL ADDRESS / ID <span className="req">*</span></label>
                    <input
                      type="email"
                      placeholder="e.g. rider.customer@gmail.com"
                      required
                      value={newRide.riderEmail}
                      onChange={(e) => setNewRide({ ...newRide, riderEmail: e.target.value })}
                    />
                  </div>

                  {/* Grid: Name, Gender, Mobile, DL */}
                  <div className="field-grid-4">
                    <div className="field-group">
                      <label>RIDER FULL NAME <span className="req">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        required
                        value={newRide.riderName}
                        onChange={(e) => setNewRide({ ...newRide, riderName: e.target.value })}
                      />
                    </div>

                    <div className="field-group">
                      <label>GENDER <span className="req">*</span></label>
                      <select
                        value={newRide.gender}
                        onChange={(e) => setNewRide({ ...newRide, gender: e.target.value })}
                      >
                        <option value="Male">👨 Male</option>
                        <option value="Female">👩 Female</option>
                        <option value="Other">👤 Other</option>
                      </select>
                    </div>

                    <div className="field-group">
                      <label>MOBILE / WHATSAPP <span className="req">*</span></label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        required
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        title="Please enter a 10-digit mobile number"
                        value={newRide.riderPhone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setNewRide({ ...newRide, riderPhone: digitsOnly });
                        }}
                      />
                    </div>

                    <div className="field-group">
                      <label>DL / GOVT ID NO. <span className="req">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. DL-072023009182"
                        required
                        value={newRide.dlNumber}
                        onChange={(e) => setNewRide({ ...newRide, dlNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* DL / AADHAAR PHOTO UPLOAD BOX */}
                  <div className="upload-doc-wrapper">
                    <label className="upload-doc-label">
                      <Upload size={18} color="#059669" /> Driving License / Aadhaar Card Photo Upload <span className="req">*</span>
                    </label>

                    <div>
                      <label htmlFor="rider-id-file-upload-input" className="upload-dropzone">
                        <Upload size={28} color="#059669" />
                        <span className="dropzone-title">
                          📁 Upload DL / Aadhaar Card Photo
                        </span>
                        <span className="dropzone-sub">
                          Supports JPG, PNG, WEBP, PDF (Front & Back Photos)
                        </span>
                      </label>
                      <input
                        id="rider-id-file-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={handleRiderIdUpload}
                        style={{ display: 'none' }}
                      />
                    </div>

                    {/* Live Preview Box */}
                    {newRide.riderIdPhoto && (
                      <div className="uploaded-preview-box">
                        <div className="preview-left">
                          <img
                            src={newRide.riderIdPhoto}
                            alt="DL / Aadhaar Document"
                            className="preview-doc-img"
                          />
                          <div>
                            <strong className="preview-title">Document Uploaded Successfully</strong>
                            <span className="preview-status">✓ Verified Identity Proof</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewRide({ ...newRide, riderIdPhoto: '' })}
                          className="btn-remove-doc"
                        >
                          Remove Document
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 2: ASSIGNED VEHICLE & RENTAL SCHEDULE */}
                <div className="form-section-box">
                  <h3 className="form-section-title">
                    <span className="section-step-badge">SECTION 2</span>
                    Assigned Vehicle & Rental Schedule
                  </h3>

                  {/* Searchable Assigned Vehicle Combobox */}
                  <div className="field-group full-width vehicle-combobox-wrapper">
                    <div className="combobox-label-row">
                      <label>SELECT ASSIGNED VEHICLE <span className="req">*</span></label>
                      <span className="combobox-hint">🔍 Type to Search Fleet</span>
                    </div>

                    <div className={`combobox-input-box ${isVehicleDropdownOpen ? 'focused' : ''}`}>
                      <input
                        type="text"
                        placeholder="Type to search vehicle by name, reg no (e.g. Thar, UK07)..."
                        value={vehicleSearchQuery}
                        onFocus={() => setIsVehicleDropdownOpen(true)}
                        onChange={(e) => {
                          setVehicleSearchQuery(e.target.value);
                          setIsVehicleDropdownOpen(true);
                        }}
                      />

                      <div className="combobox-actions">
                        {vehicleSearchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setVehicleSearchQuery('');
                              setNewRide(prev => ({ ...prev, vehicleId: '' }));
                              setIsVehicleDropdownOpen(true);
                            }}
                            className="combobox-clear-btn"
                            title="Clear Selection"
                          >
                            ✕
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                          className="combobox-arrow-btn"
                        >
                          <ChevronDown size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Dropdown Options */}
                    {isVehicleDropdownOpen && (
                      <div className="combobox-dropdown-menu">
                        {fleet.filter(f => {
                          if (f.status !== 'Available') return false;
                          const query = vehicleSearchQuery.toLowerCase().trim();
                          if (!query) return true;
                          const label = `${f.title} ${f.regNo}`.toLowerCase();
                          return label.includes(query);
                        }).length === 0 ? (
                          <div className="combobox-no-results">
                            No available vehicles matching "{vehicleSearchQuery}" found in fleet.
                          </div>
                        ) : (
                          fleet
                            .filter(f => {
                              if (f.status !== 'Available') return false;
                              const query = vehicleSearchQuery.toLowerCase().trim();
                              if (!query) return true;
                              const label = `${f.title} ${f.regNo}`.toLowerCase();
                              return label.includes(query);
                            })
                            .map(f => {
                              const isSelected = newRide.vehicleId === f.id;
                              const label = `${f.title} - ${f.regNo}`;

                              return (
                                <div
                                  key={f.id}
                                  onClick={() => {
                                    setNewRide(prev => ({ ...prev, vehicleId: f.id }));
                                    setVehicleSearchQuery(label);
                                    setIsVehicleDropdownOpen(false);
                                  }}
                                  className={`combobox-option-item ${isSelected ? 'selected' : ''}`}
                                >
                                  <div className="option-info">
                                    {f.category === 'Bike' ? <Bike size={16} color="#059669" /> : <Car size={16} color="#059669" />}
                                    <span>{label}</span>
                                  </div>
                                  <span className="option-price">₹{f.price}/day</span>
                                </div>
                              );
                            })
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pickup & Return Dates */}
                  <div className="field-grid-2">
                    <div className="field-group">
                      <label>PICKUP DATE & TIME <span className="req">*</span></label>
                      <input
                        type="datetime-local"
                        required
                        value={newRide.pickupDate}
                        onChange={(e) => {
                          const pVal = e.target.value;
                          if (pVal) {
                            const dt = new Date(pVal);
                            if (!isNaN(dt.getTime())) {
                              const retDt = new Date(dt.getTime() + (24 * 60 * 60 * 1000));
                              const tzOffset = retDt.getTimezoneOffset() * 60000;
                              const localISOReturn = new Date(retDt.getTime() - tzOffset).toISOString().slice(0, 16);
                              setNewRide(prev => ({ ...prev, pickupDate: pVal, returnDate: localISOReturn }));
                              return;
                            }
                          }
                          setNewRide(prev => ({ ...prev, pickupDate: pVal }));
                        }}
                      />
                    </div>

                    <div className="field-group">
                      <label>RETURN / DROP DATE & TIME <span className="req">*</span></label>
                      <input
                        type="datetime-local"
                        required
                        value={newRide.returnDate}
                        onChange={(e) => setNewRide({ ...newRide, returnDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: FARE, SECURITY DEPOSIT & PAYMENT */}
                <div className="form-section-box">
                  <h3 className="form-section-title">
                    <span className="section-step-badge">SECTION 3</span>
                    Payment Settlement & Security Deposit
                  </h3>

                  {/* Live Fare Calculation Summary Card */}
                  <div className="fare-calc-banner">
                    <div className="fare-calc-top">
                      <div className="calc-title-left">
                        <Wallet size={20} color="#059669" />
                        <strong>Automated Fare Calculation & Settlement</strong>
                      </div>
                      <span className="duration-pill">
                        {daysCount} {daysCount === 1 ? 'Day' : 'Days'} Duration
                      </span>
                    </div>

                    <div className="fare-stats-grid">
                      <div className="stat-col">
                        <span className="stat-label">DAILY RATE</span>
                        <strong className="stat-value">₹{dailyRate.toLocaleString()} / day</strong>
                      </div>
                      <div className="stat-col">
                        <span className="stat-label">TOTAL FARE ({daysCount} d)</span>
                        <strong className="stat-value highlight-green">₹{totalRentalFare.toLocaleString()}</strong>
                      </div>
                      <div className="stat-col">
                        <span className="stat-label">HOST SHARE (85%)</span>
                        <strong className="stat-value host-share-val">₹{hostShare.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Payment Fields */}
                  <div className="field-grid-3">
                    <div className="field-group">
                      <label>PAYMENT METHOD & STATUS <span className="req">*</span></label>
                      <select
                        value={newRide.paymentStatus}
                        onChange={(e) => setNewRide({ ...newRide, paymentStatus: e.target.value })}
                      >
                        <option value="🟢 UPI Paid">🟢 UPI Paid (Online / QR Code)</option>
                        <option value="💵 Cash Collected">💵 Cash Collected at Counter</option>
                        <option value="⏳ Pay Balance at Drop">⏳ Pay Balance at Vehicle Drop</option>
                      </select>
                    </div>

                    <div className="field-group">
                      <label>PAYMENT AMOUNT RECEIVED (₹) <span className="req">*</span></label>
                      <input
                        type="number"
                        required
                        placeholder={`e.g. ${totalRentalFare}`}
                        value={newRide.amountReceived !== undefined && newRide.amountReceived !== '' ? newRide.amountReceived : totalRentalFare}
                        onChange={(e) => setNewRide({ ...newRide, amountReceived: e.target.value })}
                      />
                    </div>

                    <div className="field-group">
                      <label>SECURITY DEPOSIT COLLECTED (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 2000"
                        value={newRide.securityDeposit}
                        onChange={(e) => setNewRide({ ...newRide, securityDeposit: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Payment Verification Checkbox */}
                  <div className="verification-check-card">
                    <label className="check-label">
                      <input
                        type="checkbox"
                        required
                        checked={newRide.isPaymentConfirmed !== false}
                        onChange={(e) => setNewRide({ ...newRide, isPaymentConfirmed: e.target.checked })}
                      />
                      <span>✓ Confirm Payment Received & Counter Verification Completed</span>
                    </label>
                    <p className="check-subtext">
                      Counter Agent / Host confirms that payment of ₹{(newRide.amountReceived !== undefined && newRide.amountReceived !== '' ? parseInt(newRide.amountReceived) : totalRentalFare).toLocaleString()} has been received & verified for this counter booking.
                    </p>
                  </div>
                </div>

                {/* Bottom Form Submit Actions */}
                <div className="new-ride-footer-actions">
                  <button 
                    type="button" 
                    className="btn-form-cancel"
                    onClick={() => navigate('/partner/dashboard')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-form-submit"
                  >
                    <CheckCircle2 size={18} /> Confirm & Register Ride
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegisterNewRide;
