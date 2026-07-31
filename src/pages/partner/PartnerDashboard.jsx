import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Handshake, LayoutDashboard, Bike, Car, Calendar, Wallet, 
  Settings, Plus, Search, Filter, CheckCircle2, Clock, 
  TrendingUp, Users, LogOut, ShieldCheck, MapPin, Eye, 
  ArrowUpRight, AlertCircle, Sparkles, X, Edit3, Trash2, Upload
} from 'lucide-react';
import './PartnerDashboard.css';

// Initial Demo Listed Vehicles for Partner
const initialPartnerFleet = [
  { id: 'PF-101', title: 'Royal Enfield Himalayan 450', category: 'Bike', regNo: 'UK07DF8812', price: 1500, location: 'Tapovan Hub', status: 'Rented', totalTrips: 18, totalEarnings: 27000, image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600' },
  { id: 'PF-102', title: 'Mahindra Thar 4x4 Hard Top', category: 'Car', regNo: 'UK07BX4490', price: 4500, location: 'Dehradun Airport', status: 'Available', totalTrips: 9, totalEarnings: 40500, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600' },
  { id: 'PF-103', title: 'Honda Activa 6G DLX', category: 'Bike', regNo: 'UK07ER1290', price: 500, location: 'Tapovan Hub', status: 'Available', totalTrips: 24, totalEarnings: 12000, image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600' },
  { id: 'PF-104', title: 'Toyota Innova Crysta 2.4 VX', category: 'Car', regNo: 'UK07AZ9900', price: 3800, location: 'Rishikesh Station', status: 'Rented', totalTrips: 11, totalEarnings: 41800, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600' },
];

const initialPartnerBookings = [
  { bookingId: 'VR-8821', vehicle: 'Royal Enfield Himalayan 450', renter: 'Amitabh Sen', dates: '29 Jul - 01 Aug 2026', totalFare: 4500, partnerShare: 3825, status: 'Active Trip', pickup: 'Tapovan Hub' },
  { bookingId: 'VR-8819', vehicle: 'Toyota Innova Crysta', renter: 'Neha Sharma', dates: '30 Jul - 02 Aug 2026', totalFare: 11400, partnerShare: 9690, status: 'Active Trip', pickup: 'Rishikesh Station' },
  { bookingId: 'VR-8790', vehicle: 'Honda Activa 6G DLX', renter: 'Rohit Verma', dates: '26 Jul - 28 Jul 2026', totalFare: 1500, partnerShare: 1275, status: 'Completed', pickup: 'Tapovan Hub' },
];

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'fleet' | 'bookings' | 'payouts' | 'settings'
  
  const [fleet, setFleet] = useState(initialPartnerFleet);
  const [bookings, setBookings] = useState(initialPartnerBookings);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Vehicle Modal State
  const [isSelectCategoryModalOpen, setIsSelectCategoryModalOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    title: '',
    category: 'Bike',
    itemType: 'Bike',
    regNo: '',
    price: '',
    weeklyRate: '',
    monthlyRate: '',
    location: 'Tapovan, Rishikesh, Uttarakhand',
    rating: '4.9',
    reviews: '24',
    engineCapacity: '452 cc',
    maxPower: '40 BHP @ 8000 RPM',
    fuelType: 'Petrol (17 Litres)',
    mileage: '30 kmpl',
    transmission: '6-Speed Manual',
    seating: '2 Persons',
    description: 'Explore the scenic mountain highways of Uttarakhand with peak reliability and power. Fully serviced vehicle with 24/7 roadside assistance.',
    included: '2 Helmets Included, Unlimited Kilometers, Basic Insurance, 24/7 Roadside Assistance',
    documents: 'Original Driving License, Aadhaar Card / Passport, Security Deposit ₹2,000',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600'
  });

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewVehicle({ ...newVehicle, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectCategory = (type) => {
    setNewVehicle({
      ...newVehicle,
      itemType: type,
      category: type === 'Bike' ? 'Bike' : 'Car'
    });
    setIsSelectCategoryModalOpen(false);
    setIsAddVehicleOpen(true);
  };

  // New Ride / Rider Registration Modal State
  const [isNewRideModalOpen, setIsNewRideModalOpen] = useState(false);
  const [newRide, setNewRide] = useState({
    riderName: '',
    riderPhone: '',
    dlNumber: '',
    riderIdPhoto: '',
    vehicleId: 'PF-102',
    pickupDate: '2026-07-31T10:00',
    returnDate: '2026-08-02T18:00',
    paymentStatus: 'UPI Paid',
    securityDeposit: '2000'
  });

  const handleRiderIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRide({ ...newRide, riderIdPhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterNewRide = (e) => {
    e.preventDefault();
    if (!newRide.riderName || !newRide.riderPhone || !newRide.dlNumber) {
      alert('Please enter Rider Name, Mobile Number, and Driving License Number.');
      return;
    }

    const selectedV = fleet.find(f => f.id === newRide.vehicleId) || fleet[0];
    const createdBooking = {
      bookingId: `VR-${Math.floor(8000 + Math.random() * 1000)}`,
      vehicle: selectedV.title,
      renter: newRide.riderName,
      dates: `${newRide.pickupDate.split('T')[0]} to ${newRide.returnDate.split('T')[0]}`,
      totalFare: selectedV.price * 2,
      partnerShare: Math.round(selectedV.price * 2 * 0.85),
      status: 'Active Trip',
      pickup: selectedV.location
    };

    setBookings([createdBooking, ...bookings]);
    
    // Update vehicle status to rented
    setFleet(fleet.map(item => item.id === selectedV.id ? { ...item, status: 'Rented' } : item));
    
    setIsNewRideModalOpen(false);
    alert(`✅ New Ride Successfully Registered for ${newRide.riderName}! Booking ID: ${createdBooking.bookingId}`);
    setNewRide({
      riderName: '',
      riderPhone: '',
      dlNumber: '',
      vehicleId: 'PF-102',
      pickupDate: '2026-07-31T10:00',
      returnDate: '2026-08-02T18:00',
      paymentStatus: 'UPI Paid',
      securityDeposit: '2000'
    });
  };

  // Exit Modal State
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('vahan_partner_auth');
    navigate('/partner/login');
  };

  const handleAddVehicleSubmit = (e) => {
    e.preventDefault();
    if (!newVehicle.title || !newVehicle.regNo || !newVehicle.price) {
      alert('Please fill in vehicle title, registration number, and daily rate.');
      return;
    }

    const created = {
      id: `PF-${Math.floor(100 + Math.random() * 900)}`,
      title: newVehicle.title,
      category: newVehicle.category,
      regNo: newVehicle.regNo,
      price: parseInt(newVehicle.price),
      location: newVehicle.location,
      status: 'Available',
      totalTrips: 0,
      totalEarnings: 0,
      image: newVehicle.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600'
    };

    setFleet([created, ...fleet]);
    setIsAddVehicleOpen(false);
    setNewVehicle({
      title: '',
      category: 'Bike',
      regNo: '',
      price: '',
      location: 'Tapovan Hub',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600'
    });
  };

  const toggleVehicleStatus = (id) => {
    setFleet(fleet.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Available' ? 'Rented' : 'Available';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  // Metrics Calculations
  const totalFleetCount = fleet.length;
  const activeRentalsCount = fleet.filter(f => f.status === 'Rented').length;
  const totalPartnerEarnings = fleet.reduce((acc, curr) => acc + curr.totalEarnings, 0);

  return (
    <div className="partner-dashboard-wrapper">
      {/* Top Header Navbar */}
      <header className="partner-header">
        <div className="partner-header-left">
          <Link to="/" className="partner-dash-brand">
            vahan<span>.rentals</span>
          </Link>
          <span className="partner-host-pill">
            <Handshake size={14} /> HOST PORTAL
          </span>
          <span className="partner-location-pill">
            <MapPin size={13} /> Tapovan Rishikesh Hub
          </span>
        </div>

        <div className="partner-header-right">
          <div className="partner-payout-balance-box">
            <Wallet size={16} className="text-emerald" />
            <div>
              <span className="payout-label">Monthly Payout</span>
              <strong className="payout-amount">₹{(totalPartnerEarnings * 0.85).toLocaleString()}</strong>
            </div>
          </div>

          <button 
            className="btn-exit-partner"
            onClick={() => setIsExitModalOpen(true)}
            title="Logout Partner Session"
          >
            <LogOut size={16} /> Exit Host Portal
          </button>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="partner-dash-container">
        {/* Sidebar Nav */}
        <aside className="partner-sidebar">
          <div className="partner-user-badge-card">
            <div className="partner-avatar-circle">
              H
            </div>
            <div>
              <h4 className="partner-host-name">Himalayan Fleet Host</h4>
              <p className="partner-host-id">ID: H-88210 • Verified Host</p>
            </div>
          </div>

          <nav className="partner-nav-menu">
            <button 
              className={`partner-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={18} /> Host Overview
            </button>

            <button 
              className={`partner-nav-btn ${activeTab === 'fleet' ? 'active' : ''}`}
              onClick={() => setActiveTab('fleet')}
            >
              <Bike size={18} /> Listed Vehicles ({fleet.length})
            </button>

            <button 
              className={`partner-nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <Calendar size={18} /> Live Reservations ({bookings.length})
            </button>

            <button 
              className={`partner-nav-btn ${activeTab === 'payouts' ? 'active' : ''}`}
              onClick={() => setActiveTab('payouts')}
            >
              <Wallet size={18} /> Earnings & Payouts
            </button>

            <button 
              className={`partner-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> Host Settings & KYC
            </button>
          </nav>

          <div className="partner-sidebar-promo">
            <Sparkles size={20} className="promo-sparkle" />
            <h5>Need Fleet Financing?</h5>
            <p>Expand your bike or car fleet with 0% commission partner loans.</p>
            <a href="https://wa.me/917060512661" target="_blank" rel="noopener noreferrer" className="promo-link">
              Contact Desk <ArrowUpRight size={14} />
            </a>
          </div>
        </aside>

        {/* Content Area */}
        <main className="partner-content-area">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="dash-title-row">
                <div>
                  <h2>Host Performance Dashboard</h2>
                  <p>Track your vehicle utilization, live bookings, and weekly payout settlements.</p>
                </div>
                <button className="btn btn-emerald" onClick={() => setIsNewRideModalOpen(true)}>
                  <Plus size={18} /> Entry New Ride
                </button>
              </div>

              {/* KPI Stat Cards Grid */}
              <div className="partner-kpi-grid">
                <div className="partner-kpi-card green">
                  <div className="kpi-icon-wrap green">
                    <Wallet size={22} />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Total Monthly Earnings</span>
                    <h3 className="kpi-value">₹{totalPartnerEarnings.toLocaleString()}</h3>
                    <span className="kpi-badge green">+18.5% vs last month</span>
                  </div>
                </div>

                <div className="partner-kpi-card teal">
                  <div className="kpi-icon-wrap teal">
                    <Bike size={22} />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Listed Vehicles</span>
                    <h3 className="kpi-value">{totalFleetCount} Vehicles</h3>
                    <span className="kpi-sub">{activeRentalsCount} Currently Rented</span>
                  </div>
                </div>

                <div className="partner-kpi-card blue">
                  <div className="kpi-icon-wrap blue">
                    <Calendar size={22} />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Active Trip Reservations</span>
                    <h3 className="kpi-value">{bookings.filter(b => b.status === 'Active Trip').length} Active</h3>
                    <span className="kpi-sub">85% Share Commission</span>
                  </div>
                </div>

                <div className="partner-kpi-card amber">
                  <div className="kpi-icon-wrap amber">
                    <ShieldCheck size={22} />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Host Rating & Health</span>
                    <h3 className="kpi-value">4.95 ⭐</h3>
                    <span className="kpi-badge amber">Top Rated Host</span>
                  </div>
                </div>
              </div>

              {/* Listed Fleet Overview Table */}
              <div className="partner-card" style={{ marginTop: '20px' }}>
                <div className="partner-card-header">
                  <h3>Your Active Vehicle Fleet</h3>
                  <button className="view-all-link" onClick={() => setActiveTab('fleet')}>View All Fleet ➔</button>
                </div>
                
                <div className="partner-table-wrap">
                  <table className="partner-table">
                    <thead>
                      <tr>
                        <th>Vehicle Name</th>
                        <th>Reg Number</th>
                        <th>Type</th>
                        <th>Daily Rate</th>
                        <th>Total Earnings</th>
                        <th>Current Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fleet.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="table-vehicle-cell">
                              <img src={item.image} alt={item.title} className="table-v-thumb" />
                              <div>
                                <strong>{item.title}</strong>
                                <p><MapPin size={11} /> {item.location}</p>
                              </div>
                            </div>
                          </td>
                          <td><strong>{item.regNo}</strong></td>
                          <td><span className="type-tag">{item.category}</span></td>
                          <td>₹{item.price} / day</td>
                          <td><strong className="text-emerald">₹{item.totalEarnings.toLocaleString()}</strong></td>
                          <td>
                            <span className={`status-pill ${item.status === 'Available' ? 'available' : 'rented'}`}>
                              {item.status === 'Available' ? '🟢 Available' : '⚡ On Rental Trip'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className={`btn-toggle-status ${item.status === 'Available' ? 'to-rented' : 'to-avail'}`}
                              onClick={() => toggleVehicleStatus(item.id)}
                            >
                              {item.status === 'Available' ? 'Mark Rented' : 'Mark Available'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: MANAGE LISTED FLEET (Matching User Screenshot Layout) */}
          {activeTab === 'fleet' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="dash-title-row">
                <div>
                  <h2>Manage Listed Fleet ({fleet.length})</h2>
                  <p>Add new bikes/cars, update daily rental rates, and control live availability.</p>
                </div>
                <button className="btn btn-emerald" onClick={() => setIsSelectCategoryModalOpen(true)}>
                  <Plus size={18} /> List New Vehicle
                </button>
              </div>

              <div className="partner-card">
                <div className="partner-table-wrap">
                  <table className="partner-table fleet-management-table">
                    <thead>
                      <tr>
                        <th>ITEM</th>
                        <th>TYPE</th>
                        <th>DAILY RATE</th>
                        <th>RATING</th>
                        <th>LOCATION</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fleet.map((v) => (
                        <tr key={v.id}>
                          <td>
                            <div className="table-vehicle-cell">
                              <img src={v.image} alt={v.title} className="table-v-thumb-lg" />
                              <div>
                                <strong className="v-title-name">{v.title}</strong>
                                <span className="v-id-code">ID: {v.title.toLowerCase().replace(/\s+/g, '-')}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="type-badge-pill">{v.category || 'Bike'}</span>
                          </td>
                          <td>
                            <strong className="v-rate-text">₹{v.price}</strong>
                          </td>
                          <td>
                            <div className="v-rating-cell">
                              <span className="star-score">★ {v.rating || '4.8'}</span>
                              <span className="review-cnt">({v.reviews || '124'})</span>
                            </div>
                          </td>
                          <td>
                            <span className="v-loc-text">{v.location || 'Rishikesh, City'}</span>
                          </td>
                          <td>
                            <span className={`status-pill-green ${v.status === 'Available' ? 'avail' : 'rented'}`}>
                              {v.status === 'Available' ? 'Available' : 'Rented'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions-cell">
                              <button 
                                type="button"
                                className="btn-action-pill-toggle"
                                onClick={() => toggleVehicleStatus(v.id)}
                              >
                                Toggle Status
                              </button>
                              <button 
                                type="button"
                                className="btn-action-circle-icon edit"
                                onClick={() => {
                                  setNewVehicle({ ...v, itemType: v.category === 'Car' ? 'Car' : 'Bike' });
                                  setIsAddVehicleOpen(true);
                                }}
                                title="Edit Listing Details"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button 
                                type="button"
                                className="btn-action-circle-icon delete"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to remove ${v.title} from your listed fleet?`)) {
                                    setFleet(fleet.filter(item => item.id !== v.id));
                                  }
                                }}
                                title="Delete Vehicle"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: RESERVATIONS */}
          {activeTab === 'bookings' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="dash-title-row">
                <div>
                  <h2>Host Live Reservations & Trip History</h2>
                  <p>View customer bookings assigned to your listed vehicle fleet.</p>
                </div>
              </div>

              <div className="partner-card">
                <div className="partner-table-wrap">
                  <table className="partner-table">
                    <thead>
                      <tr>
                        <th>Booking Ref</th>
                        <th>Vehicle Assigned</th>
                        <th>Primary Renter</th>
                        <th>Rental Dates</th>
                        <th>Total Fare</th>
                        <th>Host Payout (85%)</th>
                        <th>Trip Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, idx) => (
                        <tr key={b.bookingId || idx}>
                          <td><strong>{b.bookingId}</strong></td>
                          <td><strong>{b.vehicle}</strong></td>
                          <td>{b.renter}</td>
                          <td>{b.dates}</td>
                          <td>₹{b.totalFare}</td>
                          <td><strong className="text-emerald">₹{b.partnerShare}</strong></td>
                          <td>
                            <span className={`status-pill ${b.status === 'Active Trip' ? 'rented' : 'available'}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: PAYOUTS */}
          {activeTab === 'payouts' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="dash-title-row">
                <div>
                  <h2>Earnings & Direct Bank Payouts</h2>
                  <p>Weekly payout settlements are transferred automatically to your registered bank account every Monday.</p>
                </div>
              </div>

              <div className="payout-summary-cards">
                <div className="payout-box">
                  <span>Available Payout Balance</span>
                  <h3>₹{(totalPartnerEarnings * 0.85).toLocaleString()}</h3>
                  <button className="btn btn-emerald" onClick={() => alert('Payout request submitted to Vahan accounts desk!')}>
                    Request Instant Payout
                  </button>
                </div>

                <div className="payout-box secondary">
                  <span>Next Automatic Settlement</span>
                  <h3>Monday, 03 Aug 2026</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>HDFC Bank A/C ending in ****8821</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="dash-title-row">
                <div>
                  <h2>Host Profile & Hub Settings</h2>
                  <p>Manage your registered contact details, GST / PAN verification, and bank details.</p>
                </div>
              </div>

              <div className="partner-card" style={{ padding: '24px' }}>
                <form onSubmit={(e) => { e.preventDefault(); alert('Host Profile settings saved!'); }} className="partner-settings-form">
                  <div className="settings-grid">
                    <div className="form-group">
                      <label>Host / Agency Name</label>
                      <input type="text" defaultValue="Himalayan Fleet & Rental Host" />
                    </div>

                    <div className="form-group">
                      <label>Registered Phone Number</label>
                      <input type="tel" defaultValue="+91 70605 12661" />
                    </div>

                    <div className="form-group">
                      <label>Primary Pickup Hub</label>
                      <input type="text" defaultValue="Laxman Jhula Main Road, Tapovan Rishikesh" />
                    </div>

                    <div className="form-group">
                      <label>Bank Account Number (Payouts)</label>
                      <input type="text" defaultValue="50100234908821 (HDFC Bank)" />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-emerald" style={{ marginTop: '16px' }}>
                    Save Host Settings
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modal 0: Select Category Modal (Emerald Tone) */}
      <AnimatePresence>
        {isSelectCategoryModalOpen && (
          <div className="partner-modal-overlay">
            <motion.div 
              className="partner-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSelectCategoryModalOpen(false)}
            />
            <motion.div 
              className="partner-modal-card partner-category-modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
            >
              <div className="partner-modal-header" style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem', borderBottom: 'none' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#065f46' }}>Select Category</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                    Choose the type of vehicle or service you want to add to your fleet inventory
                  </p>
                </div>
                <button onClick={() => setIsSelectCategoryModalOpen(false)} className="close-btn"><X size={20} /></button>
              </div>

              <div className="partner-category-grid" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div 
                  className="partner-category-select-card"
                  onClick={() => handleSelectCategory('Bike')}
                >
                  <div className="partner-category-icon-circle">
                    <Bike size={32} />
                  </div>
                  <h4>Bike & Scooty</h4>
                  <p>Add motorcycles, Royal Enfields, cruisers, or automatic scooties</p>
                </div>

                <div 
                  className="partner-category-select-card"
                  onClick={() => handleSelectCategory('Car')}
                >
                  <div className="partner-category-icon-circle">
                    <Car size={32} />
                  </div>
                  <h4>Cars and Cab</h4>
                  <p>Add self-drive SUVs, 4x4 Thar, sedans, or local tour cab taxis</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 1: Add New Vehicle Registration Form (Emerald Partner Theme) */}
      <AnimatePresence>
        {isAddVehicleOpen && (
          <div className="partner-modal-overlay">
            <motion.div 
              className="partner-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddVehicleOpen(false)}
            />
            <motion.div 
              className="partner-modal-card partner-large-form-modal"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
            >
              <div className="partner-modal-header" style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} color="#059669" /> Register New Vehicle for Web Portal
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Configure complete specifications, rates, inclusions, and content shown on the public bike/car detail page.
                  </p>
                </div>
                <button onClick={() => setIsAddVehicleOpen(false)} className="close-btn"><X size={20} /></button>
              </div>

              <form onSubmit={handleAddVehicleSubmit} style={{ padding: '1.5rem', maxHeight: '78vh', overflowY: 'auto' }}>
                
                {/* SECTION 1: BASIC VEHICLE & PORTAL IDENTITY */}
                <div className="partner-form-section">
                  <h4 className="partner-section-header">
                    <span className="section-badge emerald">SECTION 1</span>
                    Basic Vehicle & Portal Identity
                  </h4>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>VEHICLE / LISTING TITLE *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Royal Enfield Himalayan 450 (Kamet White)" 
                        required 
                        value={newVehicle.title}
                        onChange={(e) => setNewVehicle({ ...newVehicle, title: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>ASSIGNED HOST PARTNER</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>(🔒 LOCKED / AUTO ASSIGNED)</span>
                      </label>
                      <input 
                        type="text" 
                        value="Himalayan Fleet Host (✓ Verified Host)"
                        disabled={true}
                        readOnly={true}
                        style={{ 
                          background: '#f1f5f9', 
                          borderColor: '#cbd5e1', 
                          fontWeight: '700', 
                          color: '#0f172a',
                          cursor: 'not-allowed' 
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-grid-4">
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        ITEM TYPE <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>(🔒 AUTO SELECTED)</span>
                      </label>
                      <select 
                        value={newVehicle.itemType}
                        disabled={true}
                        style={{ 
                          background: '#f1f5f9', 
                          cursor: 'not-allowed', 
                          opacity: 0.9, 
                          color: '#0f172a', 
                          fontWeight: '700',
                          borderColor: '#cbd5e1'
                        }}
                      >
                        <option value="Bike">🔒 Bike & Scooty</option>
                        <option value="Car">🔒 Cars and Cab</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        PORTAL CATEGORY <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '700' }}>(SELECT SUBTYPE) *</span>
                      </label>
                      <select 
                        value={newVehicle.category}
                        onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
                        style={{ 
                          background: '#ffffff', 
                          color: '#0f172a', 
                          fontWeight: '600',
                          borderColor: '#059669'
                        }}
                      >
                        {newVehicle.itemType === 'Bike' && (
                          <>
                            <option value="Bike">Bike (Motorcycle)</option>
                            <option value="Scooty">Scooty (Automatic Scooter)</option>
                            <option value="Bikes & Scooties">Bikes & Scooties (General)</option>
                          </>
                        )}
                        {newVehicle.itemType === 'Car' && (
                          <>
                            <option value="Cars & Taxi Fleet">Cars & Taxi Fleet</option>
                            <option value="Self Drive SUV / Thar">Self Drive SUV / 4x4 Thar</option>
                            <option value="Cab & Taxi Service">Cab & Taxi Service</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        VEHICLE REG. NO. <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>(🔒 ADMIN ONLY)</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. UK07AB1234" 
                        value={newVehicle.regNo || ''}
                        onChange={(e) => setNewVehicle({ ...newVehicle, regNo: e.target.value })}
                        style={{ background: '#ffffff', borderColor: '#cbd5e1' }}
                      />
                    </div>

                    <div className="form-group">
                      <label>PICKUP LOCATION *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Tapovan, Rishikesh, Uttarakhand" 
                        required 
                        value={newVehicle.location}
                        onChange={(e) => setNewVehicle({ ...newVehicle, location: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* VEHICLE PHOTO UPLOAD & URL SECTION */}
                  <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <label style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.88rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Upload size={18} color="#059669" /> Vehicle Photo Upload / Image *
                    </label>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', alignItems: 'center' }}>
                      {/* Device File Upload */}
                      <div>
                        <label 
                          htmlFor="partner-photo-upload-input"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            padding: '0.9rem',
                            background: '#ffffff',
                            border: '2px dashed #059669',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textAlign: 'center'
                          }}
                        >
                          <Upload size={22} color="#059669" />
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>
                            📁 Upload Photo from Device
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Supports JPG, PNG, WEBP (Max 5MB)
                          </span>
                        </label>
                        <input 
                          id="partner-photo-upload-input"
                          type="file" 
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          style={{ display: 'none' }}
                        />
                      </div>

                      {/* Direct Image URL */}
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>
                          OR Paste Direct Image URL:
                        </label>
                        <input 
                          type="text" 
                          placeholder="https://images.unsplash.com/..." 
                          value={newVehicle.image}
                          onChange={(e) => setNewVehicle({ ...newVehicle, image: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.82rem',
                            background: '#ffffff'
                          }}
                        />
                      </div>
                    </div>

                    {/* Live Image Preview */}
                    {newVehicle.image && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '10px', marginTop: '0.85rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img 
                            src={newVehicle.image} 
                            alt="Vehicle Preview" 
                            style={{ width: '68px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                          />
                          <div>
                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', display: 'block' }}>Photo Loaded Successfully</span>
                            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '600' }}>✓ Live Preview on Portal Listing</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewVehicle({ ...newVehicle, image: '' })}
                          style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '700' }}
                        >
                          Remove Photo
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-grid-2" style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                      <label>RATING SCORE</label>
                      <input 
                        type="text" 
                        placeholder="4.9" 
                        value={newVehicle.rating}
                        onChange={(e) => setNewVehicle({ ...newVehicle, rating: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>REVIEW COUNT</label>
                      <input 
                        type="text" 
                        placeholder="24" 
                        value={newVehicle.reviews}
                        onChange={(e) => setNewVehicle({ ...newVehicle, reviews: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: RENTAL RATES & PRICING TIERS */}
                <div className="partner-form-section">
                  <h4 className="partner-section-header">
                    <span className="section-badge emerald">SECTION 2</span>
                    Rental Rates & Pricing Tiers
                  </h4>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>DAILY RATE (STANDARD) *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ₹1,800/day" 
                        required 
                        value={newVehicle.price}
                        onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>WEEKLY PACKAGE RATE</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ₹11,200/week" 
                        value={newVehicle.weeklyRate}
                        onChange={(e) => setNewVehicle({ ...newVehicle, weeklyRate: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>MONTHLY / TOUR PACKAGE RATE</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ₹42,000/month" 
                        value={newVehicle.monthlyRate}
                        onChange={(e) => setNewVehicle({ ...newVehicle, monthlyRate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: TECHNICAL SPECIFICATIONS */}
                <div className="partner-form-section">
                  <h4 className="partner-section-header">
                    <span className="section-badge emerald">SECTION 3</span>
                    Vehicle Technical Specifications
                  </h4>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>ENGINE CAPACITY</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 452 cc" 
                        value={newVehicle.engineCapacity}
                        onChange={(e) => setNewVehicle({ ...newVehicle, engineCapacity: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>MAX POWER OUTPUT</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 40 BHP @ 8000 RPM" 
                        value={newVehicle.maxPower}
                        onChange={(e) => setNewVehicle({ ...newVehicle, maxPower: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>FUEL SYSTEM & TANK</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Petrol (17 Litres)" 
                        value={newVehicle.fuelType}
                        onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-3" style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                      <label>MILEAGE / BATTERY RANGE</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 30 kmpl" 
                        value={newVehicle.mileage}
                        onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>TRANSMISSION / GEAR</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 6-Speed Manual" 
                        value={newVehicle.transmission}
                        onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>SEATING CAPACITY</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 2 Persons" 
                        value={newVehicle.seating}
                        onChange={(e) => setNewVehicle({ ...newVehicle, seating: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: ABOUT DESCRIPTION, INCLUSIONS & REQUIREMENTS */}
                <div className="partner-form-section">
                  <h4 className="partner-section-header">
                    <span className="section-badge emerald">SECTION 4</span>
                    About Description, Inclusions & Requirements
                  </h4>

                  <div className="form-group">
                    <label>DETAILED ABOUT DESCRIPTION (DISPLAYED ON PORTAL DETAILS PAGE)</label>
                    <textarea 
                      rows={3}
                      placeholder="Explore the scenic mountain highways of Uttarakhand with peak reliability and power. Fully serviced vehicle with 24/7 roadside assistance." 
                      value={newVehicle.description}
                      onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>WHAT'S INCLUDED (SEPARATE MULTIPLE ITEMS WITH COMMAS)</label>
                    <input 
                      type="text" 
                      placeholder="2 Helmets Included, Unlimited Kilometers, Basic Insurance, 24/7 Roadside Assistance" 
                      value={newVehicle.included}
                      onChange={(e) => setNewVehicle({ ...newVehicle, included: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>REQUIRED DOCUMENTS & PICKUP TERMS</label>
                    <input 
                      type="text" 
                      placeholder="Original Driving License, Aadhaar Card / Passport, Security Deposit ₹2,000" 
                      value={newVehicle.documents}
                      onChange={(e) => setNewVehicle({ ...newVehicle, documents: e.target.value })}
                    />
                  </div>
                </div>

                {/* MODAL FOOTER ACTIONS */}
                <div className="partner-modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setIsAddVehicleOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-emerald" style={{ padding: '0.75rem 1.75rem', fontWeight: '800' }}>
                    🚀 Publish Vehicle to Portal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 3: Quick Rider Registration & Walk-in Ride Entry */}
      <AnimatePresence>
        {isNewRideModalOpen && (
          <div className="partner-modal-overlay">
            <motion.div 
              className="partner-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewRideModalOpen(false)}
            />
            <motion.div 
              className="partner-modal-card partner-large-form-modal"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
            >
              <div className="partner-modal-header" style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} color="#059669" /> Register New Rider & Walk-in Ride Entry
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Register counter walk-in customers, record driving license details, and assign live fleet ride entries.
                  </p>
                </div>
                <button onClick={() => setIsNewRideModalOpen(false)} className="close-btn"><X size={20} /></button>
              </div>

              <form onSubmit={handleRegisterNewRide} style={{ padding: '1.5rem', maxHeight: '78vh', overflowY: 'auto' }}>
                {/* SECTION 1: RIDER PERSONAL & GOVT ID VERIFICATION */}
                <div className="partner-form-section">
                  <h4 className="partner-section-header">
                    <span className="section-badge emerald">SECTION 1</span>
                    Renter / Customer Identity Verification
                  </h4>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>RIDER FULL NAME *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Rahul Sharma" 
                        required 
                        value={newRide.riderName}
                        onChange={(e) => setNewRide({ ...newRide, riderName: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>MOBILE / WHATSAPP NUMBER *</label>
                      <input 
                        type="tel" 
                        placeholder="e.g. +91 98765 43210" 
                        required 
                        value={newRide.riderPhone}
                        onChange={(e) => setNewRide({ ...newRide, riderPhone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>DRIVING LICENSE / GOVT ID NO. *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. DL-0720230091827" 
                        required 
                        value={newRide.dlNumber}
                        onChange={(e) => setNewRide({ ...newRide, dlNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* DL / AADHAAR PHOTO UPLOAD BOX (Clean Device File Upload Only) */}
                  <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <label style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.88rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Upload size={18} color="#059669" /> Driving License / Aadhaar Card Photo Upload *
                    </label>
                    
                    <div>
                      <label 
                        htmlFor="rider-id-file-upload-input"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          padding: '1.25rem',
                          background: '#ffffff',
                          border: '2px dashed #059669',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center'
                        }}
                      >
                        <Upload size={26} color="#059669" />
                        <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>
                          📁 Upload DL / Aadhaar Card Photo
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
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

                    {/* Live Preview */}
                    {newRide.riderIdPhoto && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '10px', marginTop: '0.85rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img 
                            src={newRide.riderIdPhoto} 
                            alt="DL / Aadhaar Document" 
                            style={{ width: '68px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                          />
                          <div>
                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', display: 'block' }}>Document Uploaded Successfully</span>
                            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '600' }}>✓ Verified Identity Proof</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewRide({ ...newRide, riderIdPhoto: '' })}
                          style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '700' }}
                        >
                          Remove Document
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 2: VEHICLE SELECTION & DATES */}
                <div className="partner-form-section">
                  <h4 className="partner-section-header">
                    <span className="section-badge emerald">SECTION 2</span>
                    Assigned Vehicle & Rental Schedule
                  </h4>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label>SELECT ASSIGNED VEHICLE *</label>
                    <select 
                      value={newRide.vehicleId}
                      onChange={(e) => setNewRide({ ...newRide, vehicleId: e.target.value })}
                      style={{ background: '#ffffff', color: '#0f172a', fontWeight: '700', borderColor: '#059669', width: '100%' }}
                    >
                      {fleet.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.title} ({f.regNo}) - ₹{f.price}/day ({f.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>PICKUP DATE & TIME *</label>
                      <input 
                        type="datetime-local" 
                        required 
                        value={newRide.pickupDate}
                        onChange={(e) => setNewRide({ ...newRide, pickupDate: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>RETURN / DROP DATE & TIME *</label>
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
                <div className="partner-form-section">
                  <h4 className="partner-section-header">
                    <span className="section-badge emerald">SECTION 3</span>
                    Payment Settlement & Security Deposit
                  </h4>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>PAYMENT METHOD & STATUS *</label>
                      <select 
                        value={newRide.paymentStatus}
                        onChange={(e) => setNewRide({ ...newRide, paymentStatus: e.target.value })}
                      >
                        <option value="UPI Paid">🟢 UPI Paid (Online / QR Code)</option>
                        <option value="Collected Cash">💵 Cash Collected at Counter</option>
                        <option value="Pending at Drop">⏳ Pay Balance at Vehicle Drop</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>SECURITY DEPOSIT COLLECTED (₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 2000" 
                        value={newRide.securityDeposit}
                        onChange={(e) => setNewRide({ ...newRide, securityDeposit: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>HOST PICKUP HUB LOCATION</label>
                      <input 
                        type="text" 
                        value="Tapovan Rishikesh Hub (Main Counter)" 
                        disabled={true}
                        readOnly={true}
                        style={{ background: '#f1f5f9', cursor: 'not-allowed', fontWeight: '700' }}
                      />
                    </div>
                  </div>
                </div>

                {/* MODAL FOOTER ACTIONS */}
                <div className="partner-modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setIsNewRideModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-emerald" style={{ padding: '0.75rem 1.75rem', fontWeight: '800' }}>
                    ✅ Confirm & Register Ride
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Exit Partner Portal Confirmation */}
      <AnimatePresence>
        {isExitModalOpen && (
          <div className="partner-modal-overlay">
            <motion.div 
              className="partner-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExitModalOpen(false)}
            />
            <motion.div className="partner-modal-card exit-modal">
              <h3>Confirm Host Portal Exit</h3>
              <p>Are you sure you want to log out of your Partner Host Workspace?</p>
              <div className="exit-actions">
                <button className="btn btn-outline" onClick={() => setIsExitModalOpen(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PartnerDashboard;
