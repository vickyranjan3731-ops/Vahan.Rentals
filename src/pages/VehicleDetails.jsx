import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle2, ChevronDown, ChevronUp, Calendar, Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bikeData, carData, experienceData } from '../data';
import Callback from '../components/Callback';
import AuthModal from '../components/AuthModal';
import './VehicleDetails.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  // Date selection state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 2);
    return next;
  });

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

  const getMinEndDate = () => {
    if (!startDate) return new Date();
    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  };

  // Auth & Booking state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [userAuth, setUserAuth] = useState(() => {
    const saved = localStorage.getItem('vahan_user_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const handleReserveNow = () => {
    const saved = localStorage.getItem('vahan_user_auth');
    if (!saved) {
      setIsAuthOpen(true);
    } else {
      setBookingId(`VR-${Math.floor(1000 + Math.random() * 9000)}`);
      setBookingSuccessModal(true);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUserAuth(userData);
    setIsAuthOpen(false);
    setBookingId(`VR-${Math.floor(1000 + Math.random() * 9000)}`);
    setBookingSuccessModal(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = bikeData.find(v => v.id === id) || 
                  carData.find(v => v.id === id) || 
                  experienceData.find(v => v.id === id);
    setVehicle(found);
  }, [id]);

  if (!vehicle) {
    return <div className="vehicle-details-loading">Loading vehicle details...</div>;
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const getBreadcrumbsCategory = () => {
    if (bikeData.some(b => b.id === vehicle.id)) return { name: 'Bikes & Scooties', link: '/bikes' };
    if (carData.some(c => c.id === vehicle.id)) return { name: 'Cars & Taxi Fleet', link: '/cars' };
    return { name: 'Experiences', link: '/' };
  };

  const breadcrumbCat = getBreadcrumbsCategory();

  return (
    <motion.div 
      className="vehicle-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container">
        {/* Breadcrumbs & Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="separator">›</span>
            <Link to={breadcrumbCat.link}>{breadcrumbCat.name}</Link>
            <span className="separator">›</span>
            <span className="current">{vehicle.title}</span>
          </div>

          <div className="vehicle-header">
            <h1 className="vehicle-title">{vehicle.title}</h1>
            <div className="vehicle-meta">
              <div className="meta-item rating">
                <Star size={16} fill="var(--primary-color)" color="var(--primary-color)" />
                <span className="rating-score">{vehicle.rating}</span>
                <span className="rating-count">({vehicle.reviews} reviews)</span>
              </div>
              <div className="meta-item location">
                <MapPin size={16} />
                <span>Location: {vehicle.location}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="vehicle-layout">
          {/* Main Content (Left) */}
          <div className="vehicle-main">
            {/* Gallery */}
            <motion.div 
              className="vehicle-gallery"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="gallery-main">
                <img src={vehicle.image} alt={vehicle.title} style={vehicle.objectFit ? { objectFit: vehicle.objectFit } : {}} />
              </div>
              <div className="gallery-thumbnails">
                <motion.div className="thumb empty-thumb" whileHover={{ scale: 1.05 }}>
                  <span className="icon-placeholder">🚗</span>
                </motion.div>
                <motion.div className="thumb empty-thumb" whileHover={{ scale: 1.05 }}>
                  <span className="icon-placeholder">🌄</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Host Banner */}
            <motion.div 
              className="host-banner"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              variants={fadeInUp}
            >
              <div className="host-info">
                <h4>{vehicle.category} hosted by vahan.rentals</h4>
                <p>Premium Service · Uttarakhand Special · Verified Host</p>
              </div>
              <div className="host-avatar">
                <img src="https://ui-avatars.com/api/?name=Vahan+Rentals&background=f9a826&color=fff" alt="Host" />
              </div>
            </motion.div>

            {/* About Section */}
            <motion.div 
              className="detail-section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <h3 className="section-title">About {vehicle.title}</h3>
              <div className="about-text">
                {vehicle.description ? (
                  vehicle.description.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>Explore Uttarakhand with {vehicle.title}. Managed and maintained by vahan.rentals with 24/7 support.</p>
                )}
              </div>
            </motion.div>

            {/* Rental Rates Table */}
            <motion.div 
              className="detail-section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <h3 className="section-title">Rental & Rate Structure</h3>
              <div className="rates-table-container">
                <table className="rates-table">
                  <thead>
                    <tr>
                      <th>Option / Duration</th>
                      <th>Rate</th>
                      <th>Inclusions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Standard / Daily Rate</td>
                      <td className="rate-price">{vehicle.dailyRate || vehicle.price}</td>
                      <td>Basic Insurance & Support</td>
                    </tr>
                    {vehicle.weeklyRate && (
                      <tr>
                        <td>Weekly Rate</td>
                        <td className="rate-price">{vehicle.weeklyRate}</td>
                        <td>Extended Travel Package</td>
                      </tr>
                    )}
                    {vehicle.monthlyRate && (
                      <tr>
                        <td>Monthly / Tour Package</td>
                        <td className="rate-price">{vehicle.monthlyRate}</td>
                        <td>Full Package Allowance</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="rates-note">*Rates are inclusive of taxes. Fuel/Tolls as per package terms.</p>
            </motion.div>

            {/* What's Included */}
            {vehicle.included && (
              <motion.div 
                className="detail-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                <h3 className="section-title">What's Included</h3>
                <div className="included-grid">
                  {vehicle.included.map((item, i) => (
                    <motion.div className="included-item" key={i} variants={fadeInUp}>
                      <CheckCircle2 size={18} className="text-primary" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Specifications */}
            {vehicle.specs && (
              <motion.div 
                className="detail-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                <h3 className="section-title">Specifications & Details</h3>
                <div className="specs-grid">
                  {Object.entries(vehicle.specs).map(([key, value]) => (
                    <motion.div 
                      className="spec-box" 
                      key={key} 
                      variants={fadeInUp}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    >
                      <span className="spec-label">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                      <span className="spec-value">{value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FAQs */}
            {vehicle.faqs && vehicle.faqs.length > 0 && (
              <motion.div 
                className="detail-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
              >
                <h3 className="section-title">Frequently Asked Questions</h3>
                <div className="faqs-list">
                  {vehicle.faqs.map((faq, i) => (
                    <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                      <div className="faq-question" onClick={() => toggleFaq(i)}>
                        <span>{faq.question}</span>
                        {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div 
                            className="faq-answer"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p>{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Terms & Conditions */}
            <motion.div 
              className="detail-section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <h3 className="section-title">Terms & Conditions</h3>
              <ul className="terms-list">
                <li>Valid government-issued ID and driving license required upon handover (for self-drive).</li>
                <li>Refundable security deposit is collected prior to trip start.</li>
                <li>Toll, state entry permits, and fuel fees as per chosen rental option.</li>
                <li>24/7 roadside breakdown support provided across Uttarakhand.</li>
              </ul>
            </motion.div>
            
            {/* Tags */}
            <motion.div 
              className="detail-section tags-section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <span className="tag">Tags :</span>
              <span className="tag-item">{vehicle.title} Rishikesh</span>
              <span className="tag-item">{vehicle.category} Hire</span>
              <span className="tag-item">Uttarakhand Tourism</span>
              <span className="tag-item">Vahan Rentals Desk</span>
            </motion.div>
          </div>

          {/* Sidebar (Right) */}
          <motion.div 
            className="vehicle-sidebar"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="booking-card sticky-card">
              <div className="booking-price">
                <h3>{vehicle.dailyRate || vehicle.price} <span className="price-suffix">/ starting</span></h3>
                <div className="rating-small">
                  <Star size={14} fill="var(--primary-color)" color="var(--primary-color)" />
                  <span>{vehicle.rating} ({vehicle.reviews} reviews)</span>
                </div>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label>START DATE</label>
                  <div className="input-with-icon">
                    <Calendar size={16} />
                    <DatePicker 
                      selected={startDate} 
                      onChange={handleStartDateChange} 
                      dateFormat="dd MMMM yyyy"
                      minDate={new Date()}
                      placeholderText="Select pickup date"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>END DATE</label>
                  <div className="input-with-icon">
                    <Calendar size={16} />
                    <DatePicker 
                      selected={endDate} 
                      onChange={(date) => setEndDate(date)} 
                      dateFormat="dd MMMM yyyy"
                      minDate={getMinEndDate()}
                      placeholderText="Select return date"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>LOCATION</label>
                  <div className="input-with-icon">
                    <MapPin size={16} />
                    <input type="text" readOnly value={vehicle.location} />
                  </div>
                </div>

                <motion.button 
                  className="btn btn-primary btn-full reserve-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReserveNow}
                >
                  Reserve Now
                </motion.button>
                <p className="no-charge-note">You won't be charged yet.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Request a Callback Banner */}
      <Callback />

      {/* OTP Authentication Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={handleAuthSuccess}
        title={`Login to Reserve ${vehicle.title}`}
        subtitle="Enter your mobile/email to receive a 1-time OTP verification code."
      />

      {/* Booking Confirmation Success Modal */}
      <AnimatePresence>
        {bookingSuccessModal && (
          <div className="auth-overlay">
            <motion.div 
              className="auth-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingSuccessModal(false)}
            />
            <motion.div 
              className="auth-modal booking-success-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ textAlign: 'center' }}
            >
              <button className="auth-close-btn" onClick={() => setBookingSuccessModal(false)}>
                <X size={20} />
              </button>

              <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Check size={36} />
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                Reservation Confirmed!
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Ref ID: <strong style={{ color: '#ea580c' }}>{bookingId}</strong>
              </p>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', textAlign: 'left', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Vehicle:</span>
                  <strong style={{ color: '#0f172a' }}>{vehicle.title}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Location:</span>
                  <strong>{vehicle.location}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Dates:</span>
                  <strong>{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>User Contact:</span>
                  <strong>{userAuth?.identifier || '+91 70605 12661'}</strong>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                ⚡ Our Rishikesh travel desk will send your handover receipt on WhatsApp within 10 minutes.
              </p>

              <button 
                className="btn btn-primary btn-full" 
                onClick={() => setBookingSuccessModal(false)}
                style={{ padding: '0.85rem', fontWeight: 700 }}
              >
                Got It, Thank You!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VehicleDetails;
