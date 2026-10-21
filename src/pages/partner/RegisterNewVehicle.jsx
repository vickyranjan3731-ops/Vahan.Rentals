import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Plus, CheckCircle2, Upload, Wallet,
  Bike, MapPin, Sparkles, ChevronLeft, ChevronRight,
  Handshake, LayoutDashboard, Calendar, Settings, User
} from 'lucide-react';
import { getPartnerFleet, savePartnerFleet, getPartnerBookings } from './partnerData';
import { insertVehicleToDb } from '../../services/supabaseService';
import './PartnerDashboard.css';
import './RegisterNewRide.css';
import './RegisterNewVehicle.css';

const RegisterNewVehicle = () => {
  const navigate = useNavigate();
  const [fleet, setFleet] = useState(getPartnerFleet());
  const [bookings, setBookings] = useState(getPartnerBookings());
  const [toastMessage, setToastMessage] = useState(null);

  // Sidebar States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Host Profile
  const hostProfile = {
    name: 'Himalayan Fleet Host',
    phone: '+91 70605 12661',
    hubLocation: 'Laxman Jhula Main Road, Tapovan Rishikesh',
    logo: ''
  };

  // Calculate Partner Monthly Earnings
  const totalPartnerEarnings = bookings.reduce((sum, b) => sum + (b.totalFare || 0), 0);

  // Vehicle Form State
  const [vehicleData, setVehicleData] = useState({
    title: '',
    itemType: 'Bike',
    category: 'Bike',
    regNo: '',
    location: 'Tapovan Hub, Rishikesh, Uttarakhand',
    image: '',
    rating: '4.9',
    reviews: '28',
    price: '',
    weeklyRate: '',
    monthlyRate: '',
    securityDeposit: '1000',
    engineCapacity: '452 cc',
    maxPower: '40 BHP @ 8000 RPM',
    fuelType: 'Petrol (17 Litres)',
    mileage: '30 kmpl',
    transmission: '6-Speed Manual',
    seating: '2 Persons',
    description: 'Explore the scenic mountain highways of Uttarakhand with peak reliability and power. Fully serviced vehicle with 24/7 roadside assistance.',
    included: '2 Clean ISI Helmets, Unlimited Kilometers, Basic Insurance, 24/7 Roadside Assistance',
    documents: 'Original Driving License, Aadhaar Card / Passport, Security Deposit'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size must be less than 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehicleData(prev => ({ ...prev, image: reader.result }));
        showToast('📷 Vehicle photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vehicleData.title.trim()) {
      showToast('Please enter vehicle / listing title.', 'error');
      return;
    }
    if (!vehicleData.price.trim()) {
      showToast('Please specify daily rental rate.', 'error');
      return;
    }
    if (!vehicleData.location.trim()) {
      showToast('Please specify pickup location hub.', 'error');
      return;
    }

    setIsSubmitting(true);

    const numericDailyRate = parseInt(vehicleData.price.toString().replace(/[^0-9]/g, ''), 10) || 1200;
    const vehicleId = `PF-${Math.floor(100 + Math.random() * 900)}`;

    const newVehicleObj = {
      id: vehicleId,
      title: vehicleData.title.trim(),
      category: vehicleData.category,
      itemType: vehicleData.itemType,
      regNo: vehicleData.regNo.trim() || `UK07${Math.floor(1000 + Math.random() * 9000)}`,
      price: numericDailyRate,
      dailyRate: `₹${numericDailyRate}`,
      weeklyRate: vehicleData.weeklyRate || `₹${numericDailyRate * 6}/week`,
      monthlyRate: vehicleData.monthlyRate || `₹${numericDailyRate * 22}/month`,
      location: vehicleData.location.trim(),
      status: 'Available',
      totalTrips: 0,
      totalEarnings: 0,
      rating: vehicleData.rating || '4.9',
      reviews: vehicleData.reviews || '12',
      hostedBy: hostProfile.name,
      hostPhone: hostProfile.phone,
      image: vehicleData.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
      description: vehicleData.description,
      specs: {
        engine: vehicleData.engineCapacity,
        power: vehicleData.maxPower,
        fuel: vehicleData.fuelType,
        mileage: vehicleData.mileage,
        transmission: vehicleData.transmission,
        seating: vehicleData.seating
      },
      included: vehicleData.included.split(',').map(s => s.trim()).filter(Boolean),
      requirements: vehicleData.documents.split(',').map(s => s.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    };

    // Save to Supabase Database
    insertVehicleToDb(newVehicleObj).catch(e => console.warn('Supabase vehicle insert error:', e));

    // Save into partner fleet
    const updatedFleet = [newVehicleObj, ...fleet];
    setFleet(updatedFleet);
    savePartnerFleet(updatedFleet);

    // Save into global admin fleet catalog as well
    try {
      const adminFleets = JSON.parse(localStorage.getItem('vahan_admin_fleets') || '[]');
      localStorage.setItem('vahan_admin_fleets', JSON.stringify([newVehicleObj, ...adminFleets]));
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`🎉 ${newVehicleObj.title} successfully registered and published on Vahan.Rentals portal!`);
      navigate('/partner/dashboard');
    }, 600);
  };

  return (
    <div className="partner-dashboard-wrapper">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`partner-toast ${toastMessage.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toastMessage.msg}
        </div>
      )}

      {/* TOP NAVBAR */}
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

      {/* MAIN BODY GRID WITH SIDEBAR */}
      <div className={`partner-dash-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        
        {/* SIDEBAR */}
        <aside className={`partner-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="partner-sidebar-scroll">
            <div
              className="partner-user-badge-card"
              title={isSidebarCollapsed ? `${hostProfile.name} • Verified Host` : undefined}
            >
              <div className="partner-avatar-circle" style={{ overflow: 'hidden', padding: 0 }}>
                {hostProfile.name ? hostProfile.name.charAt(0).toUpperCase() : 'H'}
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
                className="partner-nav-btn active"
                onClick={() => navigate('/partner/register-vehicle')}
                title="Register New Vehicle"
              >
                <span className="partner-nav-icon"><Plus size={19} /></span>
                {!isSidebarCollapsed && <span className="partner-nav-label">Register New Vehicle</span>}
              </button>

              <button
                className="partner-nav-btn"
                onClick={() => navigate('/partner/register-rider')}
                title="Register Walk-in Rider"
              >
                <span className="partner-nav-icon"><User size={19} /></span>
                {!isSidebarCollapsed && <span className="partner-nav-label">Walk-in Rider Entry</span>}
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
              </div>
            )}

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

        {/* MAIN CONTENT AREA */}
        <main className="partner-content-area reg-vehicle-scroll">
          <div className="reg-vehicle-container-fluid">
            
            <motion.div 
              className="reg-vehicle-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Title Banner */}
              <div className="reg-vehicle-title-banner">
                <div>
                  <div className="reg-breadcrumbs">
                    <Link to="/partner/dashboard">Partner Portal</Link>
                    <span>›</span>
                    <span className="current">Register New Vehicle</span>
                  </div>
                  <h1 className="reg-vehicle-main-title">
                    Register New Vehicle for Web Portal
                  </h1>
                  <p className="reg-vehicle-main-subtitle">
                    Configure complete specifications, rates, inclusions, and content shown on the public bike/car detail page.
                  </p>
                </div>
                <div className="reg-live-sync-badge">
                  <Sparkles size={18} />
                  <span>Instant Live Sync on Portal</span>
                </div>
              </div>

              {/* Sub-Banner Info */}
              <div className="reg-vehicle-sub-banner">
                <div>
                  <span className="official-host-pill">VAHAN.RENTALS • FLEET ONBOARDING</span>
                  <h2>Configure & Publish Vehicle Listing</h2>
                  <p>Set up vehicle specifications, high-res photos, rental pricing tiers, and inclusions shown to riders on the live website.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="reg-vehicle-form">

                {/* SECTION 1: BASIC VEHICLE & PORTAL IDENTITY */}
                <div className="reg-section-block">
                  <h3 className="reg-section-title">
                    <span className="sec-num-badge">SECTION 1</span>
                    Basic Vehicle & Portal Identity
                  </h3>

                  <div className="reg-grid-2">
                    <div className="form-group">
                      <label>VEHICLE / LISTING TITLE <span className="req">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Royal Enfield Himalayan 450 (Kamet White)"
                        required
                        value={vehicleData.title}
                        onChange={(e) => setVehicleData({ ...vehicleData, title: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>ASSIGNED HOST PARTNER</span>
                        <span className="locked-note">🔒 LOCKED / AUTO ASSIGNED</span>
                      </label>
                      <input
                        type="text"
                        value="Himalayan Fleet Host (✓ Verified Host)"
                        disabled={true}
                        readOnly={true}
                        className="locked-input"
                      />
                    </div>
                  </div>

                  <div className="reg-grid-3" style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                      <label>ITEM TYPE <span className="locked-note">🔒 AUTO</span></label>
                      <select
                        value={vehicleData.itemType}
                        disabled={true}
                        className="locked-input"
                      >
                        <option value="Bike">🔒 Bike & Scooty</option>
                        <option value="Car">🔒 Cars and Cab</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>PORTAL CATEGORY <span className="req">*</span></label>
                      <select
                        value={vehicleData.category}
                        onChange={(e) => setVehicleData({ ...vehicleData, category: e.target.value })}
                        className="category-select"
                      >
                        <option value="Bike">Bike (Motorcycle)</option>
                        <option value="Scooty">Scooty (Automatic Scooter)</option>
                        <option value="Bikes & Scooties">Bikes & Scooties (General)</option>
                        <option value="Cars & Taxi Fleet">Cars & Taxi Fleet</option>
                        <option value="Self Drive SUV / Thar">Self Drive SUV / 4x4 Thar</option>
                        <option value="Cab & Taxi Service">Cab & Taxi Service</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>VEHICLE REG. NO. <span className="admin-tag">(ADMIN / INTERNAL)</span></label>
                      <input
                        type="text"
                        placeholder="e.g. UK07AB1234"
                        value={vehicleData.regNo}
                        onChange={(e) => setVehicleData({ ...vehicleData, regNo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>PICKUP LOCATION HUB <span className="req">*</span></label>
                    <div className="input-with-icon">
                      <MapPin size={16} />
                      <input
                        type="text"
                        placeholder="e.g. Tapovan Hub, Rishikesh, Uttarakhand"
                        required
                        value={vehicleData.location}
                        onChange={(e) => setVehicleData({ ...vehicleData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* VEHICLE PHOTO UPLOAD & URL SECTION */}
                  <div className="reg-photo-upload-box">
                    <label className="photo-box-header">
                      <Upload size={18} className="text-emerald" /> Vehicle Photo Upload / Image <span className="req">*</span>
                    </label>

                    <div className="photo-upload-grid">
                      {/* Device File Upload */}
                      <div>
                        <label htmlFor="reg-page-photo-upload" className="photo-dropzone">
                          <Upload size={24} className="text-emerald" />
                          <span className="dropzone-title">📁 Upload Photo from Device</span>
                          <span className="dropzone-sub">Supports JPG, PNG, WEBP (Max 5MB)</span>
                        </label>
                        <input
                          id="reg-page-photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          style={{ display: 'none' }}
                        />
                      </div>

                      {/* Direct Image URL */}
                      <div>
                        <label className="url-input-label">OR Paste Direct High-Res Image URL:</label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={vehicleData.image}
                          onChange={(e) => setVehicleData({ ...vehicleData, image: e.target.value })}
                          className="url-input"
                        />
                        <span className="url-hint">Auto-optimized for retina screens on vehicle details page.</span>
                      </div>
                    </div>

                    {/* Live Image Preview */}
                    {vehicleData.image && (
                  <div className="photo-preview-bar">
                    <div className="preview-info">
                      <img src={vehicleData.image} alt="Vehicle Preview" className="preview-img" />
                      <div>
                        <strong>Photo Loaded Successfully</strong>
                        <span className="live-preview-chip">✓ Live Preview on Portal Listing</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVehicleData({ ...vehicleData, image: '' })}
                      className="remove-photo-btn"
                    >
                      Remove Photo
                    </button>
                  </div>
                    )}
                  </div>

                  <div className="reg-grid-2" style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                      <label>DEFAULT RATING SCORE</label>
                      <input
                        type="text"
                        placeholder="4.9"
                        value={vehicleData.rating}
                        onChange={(e) => setVehicleData({ ...vehicleData, rating: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>INITIAL REVIEW COUNT</label>
                      <input
                        type="text"
                        placeholder="28"
                        value={vehicleData.reviews}
                        onChange={(e) => setVehicleData({ ...vehicleData, reviews: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: RENTAL RATES & PRICING TIERS */}
                <div className="reg-section-block">
                  <h3 className="reg-section-title">
                    <span className="sec-num-badge">SECTION 2</span>
                    Rental Rates & Pricing Tiers
                  </h3>

                  <div className="reg-grid-3">
                    <div className="form-group">
                      <label>DAILY RATE (STANDARD) <span className="req">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. ₹1,200/day"
                        required
                        value={vehicleData.price}
                        onChange={(e) => setVehicleData({ ...vehicleData, price: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>WEEKLY PACKAGE RATE</label>
                      <input
                        type="text"
                        placeholder="e.g. ₹7,200/week"
                        value={vehicleData.weeklyRate}
                        onChange={(e) => setVehicleData({ ...vehicleData, weeklyRate: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>MONTHLY / TOUR PACKAGE RATE</label>
                      <input
                        type="text"
                        placeholder="e.g. ₹26,000/month"
                        value={vehicleData.monthlyRate}
                        onChange={(e) => setVehicleData({ ...vehicleData, monthlyRate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: TECHNICAL SPECIFICATIONS */}
                <div className="reg-section-block">
                  <h3 className="reg-section-title">
                    <span className="sec-num-badge">SECTION 3</span>
                    Vehicle Technical Specifications
                  </h3>

                  <div className="reg-grid-3">
                    <div className="form-group">
                      <label>ENGINE CAPACITY</label>
                      <input
                        type="text"
                        placeholder="e.g. 452 cc"
                        value={vehicleData.engineCapacity}
                        onChange={(e) => setVehicleData({ ...vehicleData, engineCapacity: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>MAX POWER OUTPUT</label>
                      <input
                        type="text"
                        placeholder="e.g. 40 BHP @ 8000 RPM"
                        value={vehicleData.maxPower}
                        onChange={(e) => setVehicleData({ ...vehicleData, maxPower: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>FUEL SYSTEM & TANK</label>
                      <input
                        type="text"
                        placeholder="e.g. Petrol (17 Litres)"
                        value={vehicleData.fuelType}
                        onChange={(e) => setVehicleData({ ...vehicleData, fuelType: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="reg-grid-3" style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                      <label>MILEAGE / RANGE</label>
                      <input
                        type="text"
                        placeholder="e.g. 30 kmpl"
                        value={vehicleData.mileage}
                        onChange={(e) => setVehicleData({ ...vehicleData, mileage: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>TRANSMISSION / GEARS</label>
                      <input
                        type="text"
                        placeholder="e.g. 6-Speed Manual"
                        value={vehicleData.transmission}
                        onChange={(e) => setVehicleData({ ...vehicleData, transmission: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>SEATING CAPACITY</label>
                      <input
                        type="text"
                        placeholder="e.g. 2 Persons"
                        value={vehicleData.seating}
                        onChange={(e) => setVehicleData({ ...vehicleData, seating: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: ABOUT DESCRIPTION, INCLUSIONS & REQUIREMENTS */}
                <div className="reg-section-block">
                  <h3 className="reg-section-title">
                    <span className="sec-num-badge">SECTION 4</span>
                    About Description, Inclusions & Requirements
                  </h3>

                  <div className="form-group">
                    <label>DETAILED ABOUT DESCRIPTION (DISPLAYED ON PORTAL DETAILS PAGE)</label>
                    <textarea
                      rows={3}
                      placeholder="Explore the scenic mountain highways of Uttarakhand with peak reliability and power. Fully serviced vehicle with 24/7 roadside assistance."
                      value={vehicleData.description}
                      onChange={(e) => setVehicleData({ ...vehicleData, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>WHAT'S INCLUDED (SEPARATE MULTIPLE ITEMS WITH COMMAS)</label>
                    <input
                      type="text"
                      placeholder="2 Helmets Included, Unlimited Kilometers, Basic Insurance, 24/7 Roadside Assistance"
                      value={vehicleData.included}
                      onChange={(e) => setVehicleData({ ...vehicleData, included: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>REQUIRED DOCUMENTS & PICKUP TERMS</label>
                    <input
                      type="text"
                      placeholder="Original Driving License, Aadhaar Card / Passport, Security Deposit ₹1,000"
                      value={vehicleData.documents}
                      onChange={(e) => setVehicleData({ ...vehicleData, documents: e.target.value })}
                    />
                  </div>
                </div>

                {/* ACTION BAR */}
                <div className="reg-form-actions-bar">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => navigate('/partner/dashboard')}
                    disabled={isSubmitting}
                  >
                    Cancel & Return
                  </button>

                  <button 
                    type="submit" 
                    className="btn btn-emerald publish-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Publishing to Portal...</span>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>🚀 Publish Vehicle to Live Web Portal</span>
                      </>
                    )}
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

export default RegisterNewVehicle;
