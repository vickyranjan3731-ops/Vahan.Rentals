import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Car, Bike, Compass, CalendarCheck, PhoneCall, 
  TrendingUp, Users, User, Settings, Plus, Search, Filter, Edit3, Trash2, 
  CheckCircle, Clock, XCircle, Download, LogOut, Eye, Bell, X, ShieldAlert,
  Upload, Image, ShieldCheck, Handshake, Wallet, MessageSquare
} from 'lucide-react';
import { bikeData, carData, experienceData } from '../../data';
import './Admin.css';

const initialPartnersData = [
  { id: 'H-1000', name: 'vahan.rentals (Official Fleet)', owner: 'Vahan Official Desk', phone: '+91 70605 12661', email: 'official@vahan.rentals', type: 'Official Master Host', location: 'Tapovan Rishikesh (HQ)', vehiclesCount: 12, earnings: 348500, payoutStatus: 'Settled', status: 'Active Verified', isOfficial: true },
  { id: 'H-8821', name: 'Himalayan Fleet Host', owner: 'Vikas Sharma', phone: '+91 70605 12661', email: 'partner@vahan.rentals', type: 'Bike & Scooty Host', location: 'Tapovan Rishikesh', vehiclesCount: 4, earnings: 121300, payoutStatus: 'Settled', status: 'Active Verified' },
  { id: 'H-8822', name: 'Garhwal Motors & Cab Service', owner: 'Ramesh Singh', phone: '+91 98970 12345', email: 'garhwal.cabs@gmail.com', type: 'Car & Taxi Host', location: 'Dehradun Airport', vehiclesCount: 3, earnings: 84500, payoutStatus: 'Pending (₹18,500)', status: 'Active Verified' },
  { id: 'H-8823', name: 'Ganga Valley Rentals', owner: 'Anuj Rawat', phone: '+91 94120 55667', email: 'ganga.rentals@gmail.com', type: 'Bike Host', location: 'Laxman Jhula', vehiclesCount: 2, earnings: 28000, payoutStatus: 'Settled', status: 'Active Verified' },
  { id: 'H-8824', name: 'Rishikesh Express Fleet', owner: 'Deepak Joshi', phone: '+91 98370 99881', email: 'deepak.express@gmail.com', type: 'Franchise Partner', location: 'Rishikesh Station', vehiclesCount: 1, earnings: 12000, payoutStatus: 'Pending (₹5,200)', status: 'Pending Approval' },
];

const initialBookings = [
  { id: 'VR-1092', customer: 'Rahul Verma', vehicle: 'Royal Enfield Himalayan 450', type: 'Bike', dates: '18 Jul - 20 Jul 2026', price: '₹3,000', status: 'Confirmed', location: 'Tapovan Rishikesh' },
  { id: 'VR-1093', customer: 'Ananya Roy', vehicle: 'Mahindra Thar 4x4 Hard Top', type: 'Car', dates: '19 Jul - 22 Jul 2026', price: '₹13,500', status: 'Confirmed', location: 'Dehradun Airport' },
  { id: 'VR-1094', customer: 'Vikram Seth', vehicle: 'White Water Rafting (Shivpuri)', type: 'Experience', dates: '18 Jul 2026', price: '₹2,400', status: 'Completed', location: 'Shivpuri' },
  { id: 'VR-1095', customer: 'Suresh Kumar', vehicle: 'Honda Activa 6G', type: 'Bike', dates: '20 Jul - 21 Jul 2026', price: '₹1,000', status: 'Pending', location: 'Laxman Jhula' },
  { id: 'VR-1096', customer: 'Neha Sharma', vehicle: 'Toyota Innova Crysta', type: 'Car', dates: '21 Jul - 25 Jul 2026', price: '₹18,000', status: 'Confirmed', location: 'Rishikesh Station' },
];

const initialCallbacks = [
  { id: 'CB-801', name: 'Amitabh Sen', phone: '+91 98765 12345', interest: 'Bike Rental', date: '24 Jul 2026, 14:30', status: 'New', note: 'Interested in Himalayan 450 for Chopta trip.', adminComment: '' },
  { id: 'CB-802', name: 'Priya Mehra', phone: '+91 99100 88776', interest: 'Car/Taxi Fleet', date: '24 Jul 2026, 12:15', status: 'Contacted', note: 'Asked about Char Dham Innova taxi rate.', adminComment: '' },
  { id: 'CB-803', name: 'Karan Patel', phone: '+91 98111 22334', interest: 'Experiences', date: '23 Jul 2026, 18:45', status: 'Resolved', note: 'Rafting group booking for 6 people.', adminComment: 'Confirmed rafting booking for 6 seats on 25th Jul.' },
];

const Admin = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('vahan_admin_auth') === 'true';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [fleetCategoryFilter, setFleetCategoryFilter] = useState('all');

  // KYC User Verification state
  const [kycRequests, setKycRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vahan_admin_kyc_requests') || '[]');
    } catch (err) {
      return [];
    }
  });

  const handleApproveKyc = (email) => {
    const updatedRequests = kycRequests.map(r => r.email === email ? { ...r, verificationStatus: 'verified' } : r);
    setKycRequests(updatedRequests);
    localStorage.setItem('vahan_admin_kyc_requests', JSON.stringify(updatedRequests));

    // Update current user auth if matching email
    try {
      const savedUser = JSON.parse(localStorage.getItem('vahan_user_auth') || '{}');
      if (savedUser.email === email || savedUser.identifier === email) {
        savedUser.verificationStatus = 'verified';
        localStorage.setItem('vahan_user_auth', JSON.stringify(savedUser));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Partner Management State
  const [partnersList, setPartnersList] = useState(initialPartnersData);
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    owner: '',
    phone: '',
    email: '',
    type: 'Bike & Scooty Host',
    location: 'Tapovan Rishikesh'
  });

  const handleApprovePartner = (id) => {
    setPartnersList(partnersList.map(p => p.id === id ? { ...p, status: 'Active Verified' } : p));
  };

  const handleSettlePartnerPayout = (id) => {
    setPartnersList(partnersList.map(p => p.id === id ? { ...p, payoutStatus: 'Settled' } : p));
  };

  const handleAddPartnerSubmit = (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.owner || !newPartner.phone) {
      alert('Please fill in agency name, owner name, and phone number.');
      return;
    }
    const created = {
      id: `H-${Math.floor(8825 + Math.random() * 100)}`,
      name: newPartner.name,
      owner: newPartner.owner,
      phone: newPartner.phone,
      email: newPartner.email || `${newPartner.name.toLowerCase().replace(/\s+/g, '')}@vahan.rentals`,
      type: newPartner.type,
      location: newPartner.location,
      vehiclesCount: 0,
      earnings: 0,
      payoutStatus: 'Settled',
      status: 'Active Verified'
    };
    setPartnersList([created, ...partnersList]);
    setIsAddPartnerModalOpen(false);
    setNewPartner({ name: '', owner: '', phone: '', email: '', type: 'Bike & Scooty Host', location: 'Tapovan Rishikesh' });
  };

  // Selected Booking Details Review Modal State
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [modalBookingStatus, setModalBookingStatus] = useState('');

  const handleOpenBookingModal = (booking) => {
    setSelectedBookingDetails(booking);
    setModalBookingStatus(booking.status || 'Confirmed');
  };

  const handleSaveBookingModalStatus = (e) => {
    e.preventDefault();
    if (!selectedBookingDetails) return;
    const targetId = selectedBookingDetails.id || selectedBookingDetails.bookingId;
    handleUpdateBookingStatus(targetId, modalBookingStatus);
    setSelectedBookingDetails(null);
  };

  // Exit Modal State
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // Category Selection Modal State
  const [isSelectCategoryModalOpen, setIsSelectCategoryModalOpen] = useState(false);

  // Master Fleet State combining bikeData, carData, experienceData
  const [fleetList, setFleetList] = useState([
    ...bikeData.map(b => ({ ...b, itemType: 'Bike', status: 'Available' })),
    ...carData.map(c => ({ ...c, itemType: 'Car', status: 'Available' })),
    ...experienceData.map(e => ({ ...e, itemType: 'Experience', status: 'Available' }))
  ]);

  const [bookings, setBookings] = useState(initialBookings);
  const [callbacks, setCallbacks] = useState(initialCallbacks);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const initialVehicleState = {
    title: '',
    category: 'Bikes & Scooties',
    itemType: 'Bike',
    regNo: '', // 🔒 Vehicle Registration Plate Number (Internal Admin/Partner Only - Hidden from Customer Portal)
    hostedBy: 'vahan.rentals', // Default host: Official Vahan.Rentals
    isVerifiedHost: true,
    price: '',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    rating: '4.9',
    reviews: '24',
    location: 'Tapovan, Rishikesh, Uttarakhand',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    description: 'Explore the scenic mountain highways of Uttarakhand with peak reliability and power. Fully serviced vehicle with 24/7 roadside assistance.',
    engineCapacity: '452 cc',
    maxPower: '40 BHP @ 8000 RPM',
    fuelType: 'Petrol (17 Litres)',
    mileage: '30 kmpl',
    transmission: '6-Speed Manual',
    seating: '2 Persons',
    included: '2 Helmets Included, Unlimited Kilometers, Basic Insurance, 24/7 Roadside Assistance',
    documents: 'Original Driving License, Aadhaar Card / Passport, Security Deposit ₹2,000'
  };

  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [newVehicle, setNewVehicle] = useState(initialVehicleState);

  const handleSelectCategory = (type) => {
    setEditingVehicleId(null);
    setNewVehicle({
      ...initialVehicleState,
      itemType: type,
      category: type === 'Bike' ? 'Bike' : type === 'Car' ? 'Cars & Taxi Fleet' : 'Popular Experiences',
      engineCapacity: type === 'Bike' ? '452 cc' : type === 'Car' ? '2.2L mHawk Diesel' : 'Safety Certified Equipment',
      maxPower: type === 'Bike' ? '40 BHP @ 8000 RPM' : type === 'Car' ? '130 BHP @ 3750 RPM' : 'Certified Instructors',
      transmission: type === 'Bike' ? '6-Speed Manual' : type === 'Car' ? 'Manual 4x4' : 'Guided Activity',
      seating: type === 'Bike' ? '2 Persons' : type === 'Car' ? '6-7 Seats' : 'Group Tour'
    });
    setIsSelectCategoryModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleEditVehicle = (item) => {
    setEditingVehicleId(item.id);
    const includedStr = Array.isArray(item.included) ? item.included.join(', ') : (item.included || initialVehicleState.included);
    const specs = item.specs || {};

    setNewVehicle({
      title: item.title || '',
      category: item.category || (item.itemType === 'Bike' ? 'Bikes & Scooties' : item.itemType === 'Car' ? 'Cars & Taxi Fleet' : 'Popular Experiences'),
      itemType: item.itemType || 'Bike',
      price: item.price || '',
      dailyRate: item.dailyRate || item.price || '',
      weeklyRate: item.weeklyRate || '',
      monthlyRate: item.monthlyRate || '',
      rating: item.rating || '4.9',
      reviews: item.reviews || '24',
      location: item.location || 'Tapovan, Rishikesh, Uttarakhand',
      image: item.image || '',
      description: item.description || initialVehicleState.description,
      engineCapacity: specs.engine || item.engineCapacity || '452 cc',
      maxPower: specs.power || item.maxPower || '40 BHP',
      fuelType: specs.fuelTank || specs.fuelType || item.fuelType || 'Petrol (17 Litres)',
      mileage: specs.mileage || item.mileage || '30 kmpl',
      transmission: specs.transmission || item.transmission || '6-Speed Manual',
      seating: specs.seating || item.seating || '2 Persons',
      included: includedStr,
      documents: item.documents || initialVehicleState.documents
    });

    setIsAddModalOpen(true);
  };

  const handleAddVehicleSubmit = (e) => {
    e.preventDefault();
    const priceFormatted = newVehicle.price.startsWith('₹') ? newVehicle.price : `₹${newVehicle.price}`;
    
    const includedArray = typeof newVehicle.included === 'string'
      ? newVehicle.included.split(',').map(s => s.trim()).filter(Boolean)
      : newVehicle.included;

    const specsObj = {
      engine: newVehicle.engineCapacity || '452 cc',
      power: newVehicle.maxPower || '40 BHP',
      fuelTank: newVehicle.fuelType || 'Petrol',
      mileage: newVehicle.mileage || '30 kmpl',
      transmission: newVehicle.transmission || '6-Speed Manual',
      seating: newVehicle.seating || '2 Persons'
    };

    const vehicleData = {
      ...newVehicle,
      id: editingVehicleId || `${newVehicle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
      price: priceFormatted,
      dailyRate: newVehicle.dailyRate || priceFormatted,
      included: includedArray,
      specs: specsObj,
      status: 'Available'
    };

    if (editingVehicleId) {
      setFleetList(fleetList.map(item => item.id === editingVehicleId ? vehicleData : item));
    } else {
      setFleetList([vehicleData, ...fleetList]);
    }

    setIsAddModalOpen(false);
    setEditingVehicleId(null);
    setNewVehicle(initialVehicleState);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size exceeds 5MB. Please select a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewVehicle(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Resolution Modal State
  const [pendingResolutionItem, setPendingResolutionItem] = useState(null);
  const [resolutionInputText, setResolutionInputText] = useState('');

  const handleToggleStatus = (id) => {
    setFleetList(fleetList.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Available' ? 'Under Maintenance' : 'Available';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to remove this item from the fleet?')) {
      setFleetList(fleetList.filter(item => item.id !== id));
    }
  };

  const handleUpdateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const handleUpdateCallbackComment = (id, text) => {
    setCallbacks(callbacks.map(c => c.id === id ? { ...c, adminComment: text } : c));
  };

  const handleUpdateCallbackStatus = (id, newStatus) => {
    const target = callbacks.find(c => c.id === id);
    if (newStatus === 'Resolved') {
      if (!target.adminComment || target.adminComment.trim() === '') {
        setPendingResolutionItem(target);
        setResolutionInputText('');
        return;
      }
    }
    setCallbacks(callbacks.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleSaveResolutionComment = (e) => {
    e.preventDefault();
    if (!resolutionInputText.trim()) {
      alert('Please enter a resolution comment before marking this request as Resolved & Locked.');
      return;
    }
    setCallbacks(callbacks.map(c => {
      if (c.id === pendingResolutionItem.id) {
        return { ...c, status: 'Resolved', adminComment: resolutionInputText.trim() };
      }
      return c;
    }));
    setPendingResolutionItem(null);
    setResolutionInputText('');
  };

  // Filtered Fleet
  const filteredFleet = fleetList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = fleetCategoryFilter === 'all' || item.itemType === fleetCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-brand" onClick={() => setActiveTab('dashboard')}>
            vahan<span>.rentals</span>
          </Link>
          <span className="admin-badge">ADMIN</span>
        </div>

        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'fleet' ? 'active' : ''}`}
            onClick={() => setActiveTab('fleet')}
          >
            <Bike size={18} />
            <span>Fleet Management</span>
            <span className="admin-nav-count">{fleetList.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <CalendarCheck size={18} />
            <span>Reservations</span>
            <span className="admin-nav-count">{bookings.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'callbacks' ? 'active' : ''}`}
            onClick={() => setActiveTab('callbacks')}
          >
            <PhoneCall size={18} />
            <span>Callback Desk</span>
            <span className="admin-nav-count">{callbacks.filter(c => c.status === 'New').length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'kyc' ? 'active' : ''}`}
            onClick={() => setActiveTab('kyc')}
          >
            <ShieldCheck size={18} />
            <span>KYC Verifications</span>
            <span className="admin-nav-count">{kycRequests.filter(r => r.verificationStatus === 'pending').length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'partners' ? 'active' : ''}`}
            onClick={() => setActiveTab('partners')}
          >
            <Handshake size={18} />
            <span>Partner Management</span>
            <span className="admin-nav-count">{partnersList.length}</span>
          </button>
        </nav>

        {/* Vahan Manager Sidebar Profile Card (Replaces Settings) */}
        <div style={{ padding: '0 0.75rem 0.75rem 0.75rem' }}>
          <div className="sidebar-manager-profile-card">
            <div className="manager-avatar-circle">
              AD
            </div>
            <div className="manager-info">
              <h5>Vahan Manager</h5>
              <p>Super Admin Desk</p>
            </div>
          </div>
        </div>

        <div className="admin-sidebar-footer">
          <button 
            onClick={() => setIsExitModalOpen(true)} 
            className="admin-nav-item" 
            style={{ color: '#ef4444' }}
          >
            <LogOut size={18} />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-search-wrap">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search fleet, bookings, customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="admin-user-profile">
            <button className="admin-icon-btn">
              <Bell size={18} />
              <span className="badge-dot"></span>
            </button>

            <div className="admin-avatar">
              <img src="https://ui-avatars.com/api/?name=Admin+Desk&background=ff7a00&color=fff" alt="Admin" />
              <div className="admin-avatar-info">
                <h5>Vahan Manager</h5>
                <p>Super Admin Desk</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <main className="admin-container">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="admin-page-title">
                <div>
                  <h1>Dashboard Overview</h1>
                  <p>Welcome back! Here is what's happening across Vahan Rentals today.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsSelectCategoryModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} /> Add New Vehicle
                </button>
              </div>

              {/* Stats Grid */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div>
                    <div className="stat-info-title">Monthly Revenue</div>
                    <div className="stat-info-val">₹3,48,500</div>
                    <div className="stat-info-trend"><TrendingUp size={14} /> +18.4% this month</div>
                  </div>
                  <div className="stat-icon-wrap" style={{ background: '#dcfce7', color: '#15803d' }}>
                    <TrendingUp size={24} />
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div>
                    <div className="stat-info-title">Active Fleet</div>
                    <div className="stat-info-val">{fleetList.length}</div>
                    <div className="stat-info-trend" style={{ color: '#0284c7' }}>Bikes, Cars & Experiences</div>
                  </div>
                  <div className="stat-icon-wrap" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                    <Car size={24} />
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div>
                    <div className="stat-info-title">Total Bookings</div>
                    <div className="stat-info-val">{bookings.length}</div>
                    <div className="stat-info-trend" style={{ color: '#854d0e' }}>14 Completed</div>
                  </div>
                  <div className="stat-icon-wrap" style={{ background: '#fef3c7', color: '#b45309' }}>
                    <CalendarCheck size={24} />
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div>
                    <div className="stat-info-title">Pending Callbacks</div>
                    <div className="stat-info-val">{callbacks.filter(c => c.status === 'New').length}</div>
                    <div className="stat-info-trend" style={{ color: '#b91c1c' }}>Requires Desk Followup</div>
                  </div>
                  <div className="stat-icon-wrap" style={{ background: '#fee2e2', color: '#b91c1c' }}>
                    <PhoneCall size={24} />
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">Recent Reservations</h3>
                  <button className="admin-nav-item" style={{ width: 'auto', padding: '0.4rem 0.8rem', color: '#64748b' }} onClick={() => setActiveTab('bookings')}>View All</button>
                </div>
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Vehicle / Service</th>
                        <th>Dates</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b.id || b.bookingId}>
                          <td>
                            <button 
                              type="button"
                              className="btn-booking-id-click"
                              onClick={() => handleOpenBookingModal(b)}
                              title="Click to Review Full Reservation & Renter Verification Form"
                            >
                              <Eye size={13} style={{ marginRight: '4px' }} />
                              <strong>{b.id || b.bookingId}</strong>
                            </button>
                          </td>
                          <td>{b.customer}</td>
                          <td>{b.vehicle}</td>
                          <td>{b.dates}</td>
                          <td><strong>{b.price}</strong></td>
                          <td>
                            <span className={`status-pill ${b.status === 'Confirmed' ? 'success' : b.status === 'Pending' ? 'warning' : 'info'}`}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              type="button"
                              className="btn btn-outline" 
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#ea580c', borderColor: '#fdba74', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => handleOpenBookingModal(b)}
                              title="Open Full Details & Verification Form"
                            >
                              <Eye size={13} /> Review & Action
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

          {/* TAB 2: FLEET MANAGEMENT */}
          {activeTab === 'fleet' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              
              {/* STICKY TOP HEADER & FILTERS PANEL */}
              <div className="admin-top-sticky-header">
                <div className="admin-page-title" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h1>Fleet & Experience Inventory</h1>
                    <p>Manage all listed bikes, scooties, self-drive cars, and adventure packages.</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => setIsSelectCategoryModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add New Vehicle
                  </button>
                </div>

                {/* Filter Row */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button 
                    className={`btn ${fleetCategoryFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFleetCategoryFilter('all')}
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                  >
                    All Fleet ({fleetList.length})
                  </button>
                  <button 
                    className={`btn ${fleetCategoryFilter === 'Bike' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFleetCategoryFilter('Bike')}
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                  >
                    Bikes & Scooties ({fleetList.filter(f => f.itemType === 'Bike').length})
                  </button>
                  <button 
                    className={`btn ${fleetCategoryFilter === 'Car' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFleetCategoryFilter('Car')}
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                  >
                    Cars & Cabs ({fleetList.filter(f => f.itemType === 'Car').length})
                  </button>
                  <button 
                    className={`btn ${fleetCategoryFilter === 'Experience' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFleetCategoryFilter('Experience')}
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                  >
                    Experiences ({fleetList.filter(f => f.itemType === 'Experience').length})
                  </button>
                </div>
              </div>

              {/* Fleet Table Card */}
              <div className="admin-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Type</th>
                        <th>Daily Rate</th>
                        <th>Rating</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFleet.map(item => (
                        <tr key={item.id}>
                          <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={item.image} alt={item.title} style={{ width: '48px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                            <div>
                              <strong>{item.title}</strong>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {item.id}</div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.78rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#f1f5f9' }}>
                              {item.itemType}
                            </span>
                          </td>
                          <td><strong>{item.dailyRate || item.price}</strong></td>
                          <td>★ {item.rating} ({item.reviews})</td>
                          <td>{item.location}</td>
                          <td>
                            <span className={`status-pill ${item.status === 'Available' ? 'success' : 'danger'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button 
                                className="btn btn-outline" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                onClick={() => handleToggleStatus(item.id)}
                              >
                                Toggle Status
                              </button>
                              <button 
                                className="btn btn-outline" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#0284c7', borderColor: '#bae6fd' }}
                                title="Edit Vehicle Details"
                                onClick={() => handleEditVehicle(item)}
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                className="btn btn-outline" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#fee2e2' }}
                                title="Delete Item"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 size={14} />
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
              <div className="admin-top-sticky-header">
                <div className="admin-page-title" style={{ marginBottom: 0 }}>
                  <div>
                    <h1>Customer Reservations</h1>
                    <p>View and update all confirmed and pending customer vehicle bookings.</p>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Vehicle / Experience</th>
                        <th>Rental Dates</th>
                        <th>Pickup Point</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id || b.bookingId}>
                          <td>
                            <button 
                              type="button"
                              className="btn-booking-id-click"
                              onClick={() => handleOpenBookingModal(b)}
                              title="Click to Review Full Reservation & Renter Verification Form"
                            >
                              <Eye size={13} style={{ marginRight: '4px' }} />
                              <strong>{b.id || b.bookingId}</strong>
                            </button>
                          </td>
                          <td>{b.customer}</td>
                          <td>{b.vehicle}</td>
                          <td>{b.dates}</td>
                          <td>{b.location}</td>
                          <td><strong>{b.price}</strong></td>
                          <td>
                            <span className={`status-pill ${b.status === 'Confirmed' ? 'success' : b.status === 'Pending' ? 'warning' : 'info'}`}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              type="button"
                              className="btn btn-outline" 
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#ea580c', borderColor: '#fdba74', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => handleOpenBookingModal(b)}
                              title="Open Full Details & Verification Form"
                            >
                              <Eye size={13} /> Review Details & Action
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

          {/* TAB 4: CALLBACK REQUESTS */}
          {activeTab === 'callbacks' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="admin-page-title">
                <div>
                  <h1>Callback Requests Desk</h1>
                  <p>Inquiries submitted via the "Request a Callback" banner across the website.</p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ whiteSpace: 'nowrap' }}>Ref ID</th>
                        <th>Customer Name</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Phone Number</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Interested In</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Date & Time</th>
                        <th>Customer Note</th>
                        <th>Status</th>
                        <th>Action</th>
                        <th>Admin Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {callbacks.map(c => (
                        <tr key={c.id}>
                          <td style={{ whiteSpace: 'nowrap' }}><strong>{c.id}</strong></td>
                          <td>{c.name}</td>
                          <td style={{ whiteSpace: 'nowrap' }}><strong>{c.phone}</strong></td>
                          <td style={{ whiteSpace: 'nowrap' }}>{c.interest}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{c.date}</td>
                          <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>{c.note}</td>
                          <td>
                            <span className={`status-pill ${c.status === 'New' ? 'danger' : c.status === 'Contacted' ? 'warning' : 'success'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td style={{ width: '135px', maxWidth: '140px' }}>
                            <select 
                              value={c.status} 
                              disabled={c.status === 'Resolved'}
                              onChange={(e) => handleUpdateCallbackStatus(c.id, e.target.value)}
                              style={{ 
                                padding: '0.35rem 0.5rem', 
                                borderRadius: '6px', 
                                fontSize: '0.82rem', 
                                borderColor: '#cbd5e1',
                                background: c.status === 'Resolved' ? '#f1f5f9' : '#ffffff',
                                color: c.status === 'Resolved' ? '#64748b' : '#0f172a',
                                cursor: c.status === 'Resolved' ? 'not-allowed' : 'pointer',
                                opacity: c.status === 'Resolved' ? 0.75 : 1,
                                fontWeight: c.status === 'Resolved' ? '600' : 'normal',
                                width: '125px'
                              }}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Resolved">🔒 Resolved</option>
                            </select>
                          </td>
                          <td style={{ minWidth: '170px', maxWidth: '190px' }}>
                            {c.status === 'Resolved' ? (
                              <div style={{ fontSize: '0.8rem', lineHeight: '1.35', color: '#065f46', fontWeight: '600', display: 'flex', alignItems: 'flex-start', gap: '0.35rem', background: '#ecfdf5', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid #a7f3d0', minHeight: '54px' }}>
                                <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                                <span>{c.adminComment}</span>
                              </div>
                            ) : (
                              <textarea 
                                rows={2}
                                placeholder="Enter resolution remark..." 
                                value={c.adminComment || ''}
                                onChange={(e) => handleUpdateCallbackComment(c.id, e.target.value)}
                                style={{
                                  padding: '0.45rem 0.65rem',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                  fontSize: '0.8rem',
                                  lineHeight: '1.35',
                                  width: '100%',
                                  height: '54px',
                                  resize: 'none',
                                  outline: 'none',
                                  background: '#ffffff',
                                  fontFamily: 'inherit'
                                }}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: KYC VERIFICATIONS DESK */}
          {activeTab === 'kyc' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="admin-page-title">
                <div>
                  <h1>User Profile KYC Verifications</h1>
                  <p>Review uploaded Driving Licenses & Govt IDs to grant Verified Renter badges for express vehicle checkout.</p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Renter Name</th>
                        <th>Contact Email</th>
                        <th>Phone</th>
                        <th>DL Number</th>
                        <th>Uploaded DL & ID Photos</th>
                        <th>KYC Status</th>
                        <th>Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kycRequests.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                            No pending KYC verification requests at this moment. Users can request verification from their Profile page.
                          </td>
                        </tr>
                      ) : (
                        kycRequests.map((r, idx) => (
                          <tr key={r.email || idx}>
                            <td><strong>{r.name || 'Rider User'}</strong></td>
                            <td>{r.email}</td>
                            <td>{r.phone || 'N/A'}</td>
                            <td><strong>{r.licenseNo || 'N/A'}</strong></td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem' }}>
                                {r.dlFileName && <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>DL: {r.dlFileName}</span>}
                                {r.aadharFileName && <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>ID: {r.aadharFileName}</span>}
                                {!r.dlFileName && !r.aadharFileName && <span style={{ color: '#94a3b8' }}>No files attached</span>}
                              </div>
                            </td>
                            <td>
                              <span className={`status-pill ${r.verificationStatus === 'verified' ? 'success' : r.verificationStatus === 'pending' ? 'warning' : 'danger'}`}>
                                {r.verificationStatus === 'verified' ? '✅ Verified Renter' : r.verificationStatus === 'pending' ? '⏳ Pending Review' : 'Unverified'}
                              </span>
                            </td>
                            <td>
                              {r.verificationStatus !== 'verified' ? (
                                <button 
                                  className="btn btn-primary"
                                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#16a34a', borderColor: '#16a34a', color: '#ffffff' }}
                                  onClick={() => handleApproveKyc(r.email)}
                                >
                                  <CheckCircle size={14} style={{ marginRight: '4px' }} /> Approve & Mark Verified
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>✓ Approved Renter</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: PARTNER & HOST MANAGEMENT */}
          {activeTab === 'partners' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1>Host & Partner Management Desk</h1>
                  <p>Manage registered vehicle hosts, approve onboarding applications, track partner fleet, and settle revenue payouts.</p>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsAddPartnerModalOpen(true)}
                  style={{ background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Onboard New Partner
                </button>
              </div>

              {/* Partner Overview Stats */}
              <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                    <Handshake size={22} />
                  </div>
                  <div>
                    <span className="stat-label">Active Host Partners</span>
                    <h3 className="stat-value">{partnersList.filter(p => p.status === 'Active Verified').length} Hosts</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#ccfbf1', color: '#0d9488' }}>
                    <Bike size={22} />
                  </div>
                  <div>
                    <span className="stat-label">Partner Fleet Listed</span>
                    <h3 className="stat-value">{partnersList.reduce((acc, curr) => acc + curr.vehiclesCount, 0)} Vehicles</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                    <Wallet size={22} />
                  </div>
                  <div>
                    <span className="stat-label">Total Partner Earnings</span>
                    <h3 className="stat-value">₹{partnersList.reduce((acc, curr) => acc + curr.earnings, 0).toLocaleString()}</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <span className="stat-label">Pending Approval Requests</span>
                    <h3 className="stat-value">{partnersList.filter(p => p.status !== 'Active Verified').length} Pending</h3>
                  </div>
                </div>
              </div>

              {/* Partners Table */}
              <div className="admin-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Host ID & Agency Name</th>
                        <th>Owner Name</th>
                        <th>Contact Phone / Email</th>
                        <th>Category / Hub</th>
                        <th>Fleet Count</th>
                        <th>Total Earnings & Payout</th>
                        <th>Status</th>
                        <th>Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partnersList.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <strong>{p.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>ID: {p.id}</div>
                          </td>
                          <td><strong>{p.owner}</strong></td>
                          <td>
                            <div>{p.phone}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.email}</div>
                          </td>
                          <td>
                            <span className="type-badge">{p.type}</span>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>📍 {p.location}</div>
                          </td>
                          <td><strong>{p.vehiclesCount} Vehicles</strong></td>
                          <td>
                            <strong>₹{p.earnings.toLocaleString()}</strong>
                            <div style={{ fontSize: '0.74rem', color: p.payoutStatus === 'Settled' ? '#16a34a' : '#d97706', fontWeight: '700' }}>
                              {p.payoutStatus}
                            </div>
                          </td>
                          <td>
                            <span className={`status-pill ${p.status === 'Active Verified' ? 'success' : 'warning'}`}>
                              {p.status === 'Active Verified' ? '🟢 Active Verified' : '⏳ Pending Review'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              {p.status !== 'Active Verified' && (
                                <button 
                                  className="btn btn-primary"
                                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', background: '#16a34a', borderColor: '#16a34a', color: '#ffffff' }}
                                  onClick={() => handleApprovePartner(p.id)}
                                >
                                  Approve Partner
                                </button>
                              )}
                              {p.payoutStatus.includes('Pending') && (
                                <button 
                                  className="btn btn-outline"
                                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', color: '#059669', borderColor: '#059669' }}
                                  onClick={() => handleSettlePartnerPayout(p.id)}
                                >
                                  Settle Payout
                                </button>
                              )}
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

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="admin-page-title">
                <div>
                  <h1>Platform Settings</h1>
                  <p>Configure general vahan.rentals settings and contact helplines.</p>
                </div>
              </div>

              <div className="admin-card" style={{ padding: '2rem' }}>
                <form onSubmit={(e) => { e.preventDefault(); alert('Settings saved successfully!'); }}>
                  <div className="admin-form-group">
                    <label>Business Name</label>
                    <input type="text" defaultValue="vahan.rentals" />
                  </div>
                  <div className="admin-form-group">
                    <label>Helpline Phone Number</label>
                    <input type="text" defaultValue="+91 70605 12661" />
                  </div>
                  <div className="admin-form-group">
                    <label>Support Email Address</label>
                    <input type="email" defaultValue="info@vahan.rentals" />
                  </div>
                  <div className="admin-form-group">
                    <label>Station Location</label>
                    <input type="text" defaultValue="Tapovan Main Highway, Rishikesh, Uttarakhand" />
                  </div>
                  <button className="btn btn-primary" type="submit">Save Platform Settings</button>
                </form>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* CATEGORY SELECTION POP-UP MODAL */}
      <AnimatePresence>
        {isSelectCategoryModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsSelectCategoryModalOpen(false)}>
            <motion.div 
              className="admin-modal"
              style={{ maxWidth: '680px', padding: '2rem' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal-header" style={{ border: 'none', padding: '0 0 1rem 0', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>Select Category</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
                    Choose the type of vehicle or service you want to add to your fleet inventory
                  </p>
                </div>
                <button 
                  onClick={() => setIsSelectCategoryModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="category-select-grid">
                {/* Option 1: Bike & Scooty */}
                <div className="category-select-card" onClick={() => handleSelectCategory('Bike')}>
                  <div className="category-icon-circle">
                    <Bike size={32} />
                  </div>
                  <h4>Bike & Scooty</h4>
                  <p>Add motorcycles, Royal Enfields, cruisers, or automatic scooties</p>
                </div>

                {/* Option 2: Cars and Cab */}
                <div className="category-select-card" onClick={() => handleSelectCategory('Car')}>
                  <div className="category-icon-circle">
                    <Car size={32} />
                  </div>
                  <h4>Cars and Cab</h4>
                  <p>Add self-drive SUVs, 4x4 Thar, sedans, or local tour cab taxis</p>
                </div>

                {/* Option 3: Popular Experiences */}
                <div className="category-select-card" onClick={() => handleSelectCategory('Experience')}>
                  <div className="category-icon-circle">
                    <Compass size={32} />
                  </div>
                  <h4>Popular Experiences</h4>
                  <p>Add adventure rafting, camping, or local tour packages</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT VEHICLE FORM MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="admin-modal-overlay">
            <motion.div 
              className="admin-modal"
              style={{ maxWidth: '840px', width: '95%' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="admin-modal-header" style={{ padding: '1.25rem 1.75rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                    {editingVehicleId ? '✏️ Edit Vehicle & Portal Listing Details' : '➕ Register New Vehicle for Web Portal'}
                  </h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Configure complete specifications, rates, inclusions, and content shown on the public bike/car detail page.
                  </p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem', borderRadius: '50%' }}
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleAddVehicleSubmit} className="admin-modal-body" style={{ padding: '1.75rem', maxHeight: '75vh', overflowY: 'auto' }}>
                
                {/* SECTION 1: BASIC INFORMATION */}
                <div style={{ marginBottom: '1.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#fff7ed', color: '#ea580c', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>SECTION 1</span>
                    Basic Vehicle & Portal Identity
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="admin-form-group">
                      <label>Vehicle / Listing Title *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Royal Enfield Himalayan 450 (Kamet White)" 
                        required 
                        value={newVehicle.title}
                        onChange={(e) => setNewVehicle({ ...newVehicle, title: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        Assigned Host Partner <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>(🔒 Locked / Auto Assigned)</span>
                      </label>
                      <input 
                        type="text" 
                        value={newVehicle.hostedBy ? `${newVehicle.hostedBy} (✓ Verified Host)` : 'vahan.rentals (Official Master Fleet) ☑ Verified'}
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        Item Type <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>(🔒 Auto Selected)</span>
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
                        <option value="Experience">🔒 Popular Experiences</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        Portal Category <span style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: '700' }}>(Select Subtype) *</span>
                      </label>
                      <select 
                        value={newVehicle.category}
                        onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
                        style={{ 
                          background: '#ffffff', 
                          color: '#0f172a', 
                          fontWeight: '600',
                          borderColor: '#ea580c'
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
                        {newVehicle.itemType === 'Experience' && (
                          <>
                            <option value="Popular Experiences">Popular Experiences</option>
                            <option value="River Rafting">River Rafting</option>
                            <option value="Camping & Trekking">Camping & Trekking</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        Vehicle Reg. No. <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>(🔒 Admin Only)</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. UK07AB1234" 
                        value={newVehicle.regNo || ''}
                        onChange={(e) => setNewVehicle({ ...newVehicle, regNo: e.target.value })}
                        style={{ background: '#ffffff', borderColor: '#cbd5e1' }}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Pickup Location *</label>
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
                  <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                    <label style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.88rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Upload size={18} color="#ea580c" /> Vehicle Photo Upload / Image *
                    </label>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', alignItems: 'center' }}>
                      {/* Option A: Device File Upload */}
                      <div>
                        <label 
                          htmlFor="vehicle-photo-upload-input"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            padding: '0.9rem',
                            background: '#ffffff',
                            border: '2px dashed #ea580c',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textAlign: 'center'
                          }}
                        >
                          <Upload size={22} color="#ea580c" />
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>
                            📁 Upload Photo from Device
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Supports JPG, PNG, WEBP (Max 5MB)
                          </span>
                        </label>
                        <input 
                          id="vehicle-photo-upload-input"
                          type="file" 
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          style={{ display: 'none' }}
                        />
                      </div>

                      {/* Option B: Direct Image URL */}
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '8px', marginTop: '0.85rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img 
                            src={newVehicle.image} 
                            alt="Vehicle Preview" 
                            style={{ width: '68px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                          />
                          <div>
                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a', display: 'block' }}>Photo Loaded Successfully</span>
                            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '600' }}>✓ Live Preview on Portal Listing</span>
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div className="admin-form-group">
                      <label>Rating Score</label>
                      <input 
                        type="text" 
                        placeholder="4.9" 
                        value={newVehicle.rating}
                        onChange={(e) => setNewVehicle({ ...newVehicle, rating: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Review Count</label>
                      <input 
                        type="text" 
                        placeholder="38" 
                        value={newVehicle.reviews}
                        onChange={(e) => setNewVehicle({ ...newVehicle, reviews: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: RENTAL & RATE STRUCTURE */}
                <div style={{ marginBottom: '1.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>SECTION 2</span>
                    Rental Rates & Pricing Tiers
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label>Daily Rate (Standard) *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ₹1,800/day" 
                        required 
                        value={newVehicle.price}
                        onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value, dailyRate: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Weekly Package Rate</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ₹11,200/week" 
                        value={newVehicle.weeklyRate}
                        onChange={(e) => setNewVehicle({ ...newVehicle, weeklyRate: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Monthly / Tour Package Rate</label>
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
                <div style={{ marginBottom: '1.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>SECTION 3</span>
                    Vehicle Technical Specifications
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label>Engine Capacity</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 452 cc, Liquid Cooled" 
                        value={newVehicle.engineCapacity}
                        onChange={(e) => setNewVehicle({ ...newVehicle, engineCapacity: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Max Power Output</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 40 BHP @ 8000 RPM" 
                        value={newVehicle.maxPower}
                        onChange={(e) => setNewVehicle({ ...newVehicle, maxPower: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Fuel System & Tank</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Petrol (17L Tank)" 
                        value={newVehicle.fuelType}
                        onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label>Mileage / Battery Range</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 30 kmpl" 
                        value={newVehicle.mileage}
                        onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Transmission / Gear</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 6-Speed Manual" 
                        value={newVehicle.transmission}
                        onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Seating Capacity</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 2 Persons" 
                        value={newVehicle.seating}
                        onChange={(e) => setNewVehicle({ ...newVehicle, seating: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: DESCRIPTION & PORTAL DETAILS */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#fef3c7', color: '#d97706', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>SECTION 4</span>
                    About Description, Inclusions & Requirements
                  </h4>

                  <div className="admin-form-group">
                    <label>Detailed About Description (Displayed on Portal Details Page)</label>
                    <textarea 
                      rows={3}
                      placeholder="Write detailed information about the vehicle, performance features, and mountain terrain capabilities..." 
                      value={newVehicle.description}
                      onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>What's Included (Separate multiple items with commas)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2 Helmets Included, Unlimited Kilometers, Basic Insurance, 24/7 Roadside Assistance" 
                      value={newVehicle.included}
                      onChange={(e) => setNewVehicle({ ...newVehicle, included: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Required Documents & Pickup Terms</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Original Driving License, Aadhaar Card / Passport, Security Deposit ₹2,000" 
                      value={newVehicle.documents}
                      onChange={(e) => setNewVehicle({ ...newVehicle, documents: e.target.value })}
                    />
                  </div>
                </div>

                {/* MODAL FOOTER ACTIONS */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#ff7a00', borderColor: '#ff7a00', fontWeight: '700', padding: '0.65rem 1.75rem' }}>
                    {editingVehicleId ? '💾 Update Vehicle Listing' : '🚀 Publish Vehicle to Portal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EXIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {isExitModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsExitModalOpen(false)}>
            <motion.div 
              className="admin-modal"
              style={{ maxWidth: '420px', textAlign: 'center', padding: '2rem' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <LogOut size={28} />
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                Exit Admin Panel?
              </h3>
              
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 1.75rem 0' }}>
                Are you sure you want to exit the admin dashboard and return to the main customer website?
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button 
                  className="btn btn-outline" 
                  onClick={() => setIsExitModalOpen(false)}
                  style={{ width: '100%', padding: '0.75rem', fontWeight: '700' }}
                >
                  Cancel
                </button>
                <button 
                  className="btn" 
                  onClick={() => {
                    setIsExitModalOpen(false);
                    localStorage.removeItem('vahan_admin_auth');
                    navigate('/admin/login');
                  }}
                  style={{ width: '100%', padding: '0.75rem', fontWeight: '700', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Yes, Exit Admin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESOLUTION COMMENT POP-UP MODAL */}
      <AnimatePresence>
        {pendingResolutionItem && (
          <div className="admin-modal-overlay" onClick={() => setPendingResolutionItem(null)}>
            <motion.div 
              className="admin-modal"
              style={{ maxWidth: '500px', padding: '1.75rem' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal-header" style={{ border: 'none', padding: '0 0 1rem 0' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Add Resolution Comment</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                    A comment is required before marking <strong>{pendingResolutionItem.name}</strong> ({pendingResolutionItem.id}) as Resolved & Locked.
                  </p>
                </div>
                <button 
                  onClick={() => setPendingResolutionItem(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveResolutionComment}>
                <div className="admin-form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Admin Remark / Resolution Note *</label>
                  <textarea 
                    rows={4}
                    placeholder="e.g. Called customer on phone, confirmed booking details for Himalayan 450 on 20th July."
                    required
                    value={resolutionInputText}
                    onChange={(e) => setResolutionInputText(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setPendingResolutionItem(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={16} /> Save & Lock Status
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Onboard New Partner */}
      <AnimatePresence>
        {isAddPartnerModalOpen && (
          <div className="admin-modal-overlay">
            <motion.div 
              className="admin-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddPartnerModalOpen(false)}
            />
            <motion.div 
              className="admin-modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="admin-modal-header">
                <h3>Onboard New Vehicle Partner / Host</h3>
                <button onClick={() => setIsAddPartnerModalOpen(false)} className="admin-modal-close"><X size={20} /></button>
              </div>

              <form onSubmit={handleAddPartnerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
                <div className="admin-form-group">
                  <label>Host Agency / Business Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Kedarnath Bike Host" 
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label>Owner Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rajesh Kumar" 
                      value={newPartner.owner}
                      onChange={(e) => setNewPartner({ ...newPartner, owner: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. +91 9876543210" 
                      value={newPartner.phone}
                      onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label>Category</label>
                    <select 
                      value={newPartner.type}
                      onChange={(e) => setNewPartner({ ...newPartner, type: e.target.value })}
                    >
                      <option value="Bike & Scooty Host">🛵 Bike & Scooty Host</option>
                      <option value="Car & Taxi Host">🚗 Car & Taxi Host</option>
                      <option value="Franchise Partner">📍 Franchise Hub Partner</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Pickup Location Hub</label>
                    <select 
                      value={newPartner.location}
                      onChange={(e) => setNewPartner({ ...newPartner, location: e.target.value })}
                    >
                      <option value="Tapovan Rishikesh">Tapovan Rishikesh Hub</option>
                      <option value="Rishikesh Station">Rishikesh Station</option>
                      <option value="Dehradun Airport">Dehradun Airport</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsAddPartnerModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#059669', borderColor: '#059669', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={16} /> Save & Activate Partner
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Full Booking & Renter Verification Form Review */}
      <AnimatePresence>
        {selectedBookingDetails && (
          <div className="admin-modal-overlay">
            <motion.div 
              className="admin-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBookingDetails(null)}
            />
            <motion.div 
              className="admin-modal-card booking-review-modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="admin-modal-header" style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="booking-ref-title-badge">REF: {selectedBookingDetails.id || selectedBookingDetails.bookingId}</span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>Reservation & Renter Verification Form</h3>
                </div>
                <button onClick={() => setSelectedBookingDetails(null)} className="admin-modal-close"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveBookingModalStatus} style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '80vh' }}>
                
                {/* SECTION 1: PRIMARY RENTER IDENTITY & CONTACT */}
                <div className="booking-review-section">
                  <div className="review-section-header">
                    <User size={16} className="text-primary" />
                    <h4>Primary Renter Verification & Contact Info</h4>
                  </div>

                  <div className="review-grid-3">
                    <div className="review-field-box">
                      <span className="field-label">Full Renter Name</span>
                      <strong className="field-value">{selectedBookingDetails.customer || selectedBookingDetails.renterName || 'Rahul Verma'}</strong>
                    </div>

                    <div className="review-field-box">
                      <span className="field-label">Mobile Number (WhatsApp)</span>
                      <strong className="field-value">{selectedBookingDetails.phone || '+91 70605 12661'}</strong>
                    </div>

                    <div className="review-field-box">
                      <span className="field-label">Driving License / Govt ID</span>
                      <strong className="field-value text-emerald">{selectedBookingDetails.licenseNo || 'UK0720210098412'}</strong>
                    </div>
                  </div>

                  {/* ID Upload Files Status */}
                  <div className="id-verification-files-row" style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                    <div className="id-file-badge green">
                      <CheckCircle size={14} />
                      <span>Driving License Document Verified</span>
                    </div>
                    <div className="id-file-badge blue">
                      <ShieldCheck size={14} />
                      <span>Aadhaar / ID Proof Verified</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: RESERVED VEHICLE & PICKUP SCHEDULE */}
                <div className="booking-review-section" style={{ marginTop: '16px' }}>
                  <div className="review-section-header">
                    <Bike size={16} className="text-primary" />
                    <h4>Reserved Vehicle & Pickup Hub</h4>
                  </div>

                  <div className="review-vehicle-box">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div className="review-v-thumb-box">
                        <img 
                          src={selectedBookingDetails.vehicleImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=300'} 
                          alt="Vehicle" 
                        />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0f172a' }}>
                          {selectedBookingDetails.vehicle || 'Royal Enfield Himalayan 450'}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                          📍 Pickup Hub: <strong>{selectedBookingDetails.location || 'Tapovan Rishikesh Hub'}</strong>
                        </p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                          📅 Duration: <strong>{selectedBookingDetails.dates || '18 Jul - 20 Jul 2026'}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: FARE BREAKDOWN & PAYMENT */}
                <div className="booking-review-section" style={{ marginTop: '16px' }}>
                  <div className="review-section-header">
                    <Wallet size={16} className="text-primary" />
                    <h4>Payment Breakdown & Settlement</h4>
                  </div>

                  <div className="review-grid-3">
                    <div className="review-field-box">
                      <span className="field-label">Total Booking Fare</span>
                      <strong className="field-value" style={{ fontSize: '1.1rem', color: '#0f172a' }}>
                        {selectedBookingDetails.price || '₹3,000'}
                      </strong>
                    </div>

                    <div className="review-field-box">
                      <span className="field-label">Online Advance Paid</span>
                      <strong className="field-value text-emerald">
                        ₹300 Paid Online (Token)
                      </strong>
                    </div>

                    <div className="review-field-box">
                      <span className="field-label">Balance Due at Pickup Desk</span>
                      <strong className="field-value" style={{ color: '#ea580c' }}>
                        ₹2,700 (Pay at Counter)
                      </strong>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: ADMIN STATUS REVIEW & ACTIONS */}
                <div className="booking-review-section" style={{ marginTop: '16px', background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <div className="review-section-header">
                    <Settings size={16} className="text-primary" />
                    <h4>Admin Decision & Booking Status Action</h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'center' }}>
                    <div className="admin-form-group">
                      <label>Update Reservation Status *</label>
                      <select 
                        value={modalBookingStatus}
                        onChange={(e) => setModalBookingStatus(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', borderColor: '#ea580c' }}
                      >
                        <option value="Confirmed">🟢 Confirmed & Token Paid</option>
                        <option value="Active Trip">⚡ Active Trip (On Road)</option>
                        <option value="Completed">✅ Completed & Handed Over</option>
                        <option value="Cancelled">❌ Cancelled / Refunded</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                      <a 
                        href={`https://wa.me/917060512661?text=${encodeURIComponent(`Hi ${selectedBookingDetails.customer || 'Customer'}, your booking ${selectedBookingDetails.id || selectedBookingDetails.bookingId} (${selectedBookingDetails.vehicle}) has been reviewed & updated to ${modalBookingStatus}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#16a34a', borderColor: '#86efac' }}
                      >
                        <MessageSquare size={14} /> Send WhatsApp Voucher
                      </a>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setSelectedBookingDetails(null)}>Close</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#ea580c', borderColor: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> Save & Lock Booking Status
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
