import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle2, ChevronDown, ChevronUp, Calendar, Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bikeData, carData, experienceData } from '../data';
import Callback from '../components/Callback';
import AuthModal from '../components/AuthModal';
import ReservationModal from '../components/ReservationModal';
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
  const [selectedImg, setSelectedImg] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  });
  const [openFaq, setOpenFaq] = useState(0);

  // Reservation Registration & Auth state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);

  const [userAuth, setUserAuth] = useState(() => {
    const saved = localStorage.getItem('vahan_user_auth');
    return saved ? JSON.parse(saved) : null;
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

  const handleReserveNow = () => {
    setIsReservationModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setUserAuth(userData);
    setIsAuthOpen(false);
    setIsReservationModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = bikeData.find(v => v.id === id) || 
                  carData.find(v => v.id === id) || 
                  experienceData.find(v => v.id === id);
    setVehicle(found);
  }, [id]);

  // Inject Vehicle & Product Schema JSON-LD for AI search crawlers
  useEffect(() => {
    if (!vehicle) return;

    const schemaData = [
      {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": vehicle.title,
        "image": [vehicle.image],
        "description": vehicle.description,
        "brand": {
          "@type": "Brand",
          "name": "Vahan Rentals"
        },
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "INR",
          "price": (vehicle.dailyRate || vehicle.price || '500').replace(/[^0-9]/g, ''),
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": vehicle.rating || "4.8",
          "reviewCount": vehicle.reviews || "120"
        }
      }
    ];

    if (vehicle.faqs && vehicle.faqs.length > 0) {
      schemaData.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": vehicle.faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      });
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `vehicle-ldjson-${vehicle.id}`;
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(`vehicle-ldjson-${vehicle.id}`);
      if (el) el.remove();
    };
  }, [vehicle]);

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
              className="host-banner verified-host-banner-box"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              variants={fadeInUp}
            >
              <div className="host-avatar-wrapper">
                <div className="host-avatar">
                  <img src="https://ui-avatars.com/api/?name=Vahan+Rentals&background=059669&color=fff" alt="Host" />
                </div>
                <span className="host-verified-badge-icon" title="Verified Host">
                  <CheckCircle2 size={14} />
                </span>
              </div>
              <div className="host-info">
                <div className="host-name-row">
                  <h4>Hosted by {vehicle.hostedBy || 'vahan.rentals'}</h4>
                  <span className="verified-host-chip">
                    <CheckCircle2 size={13} /> Verified Official Host
                  </span>
                </div>
                <p>Official Fleet Partner · 24/7 Roadside Support · Verified Vehicle Inspection</p>
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

            {/* GEO Pillar: Detailed Comparison (X vs Y) */}
            {vehicle.comparisonWith && (
              <motion.div 
                className="detail-section geo-block"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
              >
                <h3 className="section-title">Detailed Comparison (X vs Y)</h3>
                <div className="v-comparison-box">
                  <div className="v-comp-badge">⚡ {vehicle.comparisonWith.vsLabel}</div>
                  <div className="v-comp-grid">
                    <div className="v-comp-col win">
                      <h4>Best For: {vehicle.title}</h4>
                      <p>{vehicle.comparisonWith.winnerFor}</p>
                    </div>
                    <div className="v-comp-col alt">
                      <h4>Alternative: {vehicle.comparisonWith.alternativeTitle}</h4>
                      <p>{vehicle.comparisonWith.alternativeWinnerFor}</p>
                    </div>
                  </div>
                  <p className="v-comp-summary">💡 <strong>Expert Verdict:</strong> {vehicle.comparisonWith.summary}</p>
                </div>
              </motion.div>
            )}

            {/* GEO Pillar: Expert Quote & Maintenance Insight */}
            {vehicle.expertTip && (
              <motion.div 
                className="detail-section geo-block"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
              >
                <h3 className="section-title">Expert Mechanic & Fleet Tip</h3>
                <div className="v-expert-quote-card">
                  <div className="v-quote-icon">🛠️</div>
                  <div className="v-quote-content">
                    <p className="v-quote-text">"{vehicle.expertTip.quote}"</p>
                    <div className="v-quote-author">
                      <strong>— {vehicle.expertTip.author}</strong>
                      <span>{vehicle.expertTip.role}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* GEO Pillar: Real Experience & Verified Case Study */}
            {vehicle.realStory && (
              <motion.div 
                className="detail-section geo-block"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
              >
                <h3 className="section-title">Verified Renter Story & Case Study</h3>
                <div className="v-story-card">
                  <div className="v-story-header">
                    <span className="v-story-author">👤 {vehicle.realStory.author}</span>
                    <span className="v-story-route">📍 {vehicle.realStory.tripRoute}</span>
                  </div>
                  <p className="v-story-text">"{vehicle.realStory.testimonial}"</p>
                </div>
              </motion.div>
            )}

            {/* GEO Pillar: Use Cases & Rider Profiles */}
            {vehicle.useCases && vehicle.useCases.length > 0 && (
              <motion.div 
                className="detail-section geo-block"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
              >
                <h3 className="section-title">Recommended Use Cases & Best Routes</h3>
                <ul className="v-usecases-list">
                  {vehicle.useCases.map((uc, i) => (
                    <li key={i}>
                      <span className="check-icon">✓</span>
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* GEO Pillar: Step-by-Step Handover Protocol */}
            <motion.div 
              className="detail-section geo-block"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <h3 className="section-title">Standard Handover & Ride Protocol</h3>
              <div className="v-protocol-grid">
                <div className="v-proto-step">
                  <span className="v-proto-badge">Step 1</span>
                  <h4>Digital License Check</h4>
                  <p>Submit driving license and government ID upon pickup.</p>
                </div>
                <div className="v-proto-step">
                  <span className="v-proto-badge">Step 2</span>
                  <h4>Joint Inspection</h4>
                  <p>Walk around with fleet manager, check fuel level, tires & lights.</p>
                </div>
                <div className="v-proto-step">
                  <span className="v-proto-badge">Step 3</span>
                  <h4>24/7 Roadside Backup</h4>
                  <p>Access round-the-clock emergency support across Uttarakhand.</p>
                </div>
                <div className="v-proto-step">
                  <span className="v-proto-badge">Step 4</span>
                  <h4>Instant Deposit Refund</h4>
                  <p>Get your security deposit back immediately upon vehicle return.</p>
                </div>
              </div>
            </motion.div>

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

      {/* Vehicle Reservation Registration Modal */}
      <ReservationModal 
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        vehicle={vehicle}
        initialStartDate={startDate}
        initialEndDate={endDate}
        initialLocation={vehicle.location}
        onReservationSuccess={(data) => {
          setCompletedBooking(data);
          setBookingSuccessModal(true);
        }}
      />

      {/* Booking Confirmation Success Receipt Modal */}
      <AnimatePresence>
        {bookingSuccessModal && completedBooking && (
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
              style={{ textAlign: 'center', maxWidth: '480px' }}
            >
              <button className="auth-close-btn" onClick={() => setBookingSuccessModal(false)}>
                <X size={20} />
              </button>

              <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Check size={36} />
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                Reservation Registered!
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.1rem' }}>
                Booking Ref ID: <strong style={{ color: '#ff9800' }}>{completedBooking.bookingId}</strong>
              </p>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', textAlign: 'left', fontSize: '0.84rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Renter Name:</span>
                  <strong style={{ color: '#0f172a' }}>{completedBooking.fullName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Contact:</span>
                  <strong>{completedBooking.phone}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>DL / ID No:</span>
                  <strong>{completedBooking.licenseNo}</strong>
                </div>
                <div style={{ borderTop: '1px dashed #e2e8f0', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Vehicle:</span>
                  <strong style={{ color: '#0f172a' }}>{completedBooking.vehicleTitle}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Pickup Hub:</span>
                  <strong>{completedBooking.pickupLocation}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Rental Dates:</span>
                  <strong>{completedBooking.formattedStartDate} - {completedBooking.formattedEndDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ color: '#64748b' }}>Total Rental Fare:</span>
                  <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>₹{completedBooking.totalAmount}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Online Advance Token:</span>
                  <strong style={{ color: '#16a34a', fontSize: '0.95rem' }}>₹{completedBooking.totalAmountToPayNow}</strong>
                </div>
                {completedBooking.paymentMethod === 'pickup' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Balance Due at Pickup:</span>
                    <strong style={{ color: '#ea580c' }}>₹{completedBooking.remainingAmountAtPickup}</strong>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                  <span style={{ color: '#64748b' }}>Payment Mode:</span>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700 }}>
                    {completedBooking.paymentMethod === 'pickup' ? `Token ₹${completedBooking.totalAmountToPayNow} Online + Pay at Counter` : 'Paid Full Amount Online'}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                ⚡ Our Uttarakhand travel desk has recorded your reservation. Bring your driving license & Govt ID at pickup.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a 
                  href={`https://wa.me/917060512661?text=${encodeURIComponent(`Hi Vahan Rentals, I have registered booking ${completedBooking.bookingId} for ${completedBooking.vehicleTitle} (${completedBooking.formattedStartDate} to ${completedBooking.formattedEndDate}). Please confirm pickup details.`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ background: '#25d366', color: '#ffffff', padding: '0.8rem', fontWeight: 700, borderRadius: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  💬 Send Slip on WhatsApp
                </a>

                <button 
                  className="btn btn-outline btn-full" 
                  onClick={() => setBookingSuccessModal(false)}
                  style={{ padding: '0.75rem', fontWeight: 700 }}
                >
                  Close & Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VehicleDetails;
