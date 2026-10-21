import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Car, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Hero.css';

const heroSlides = [
  {
    url: '/hero-slide-2.jpg',
    label: 'Kedarnath Temple',
  },
  {
    url: '/hero-slide-3.jpg',
    label: 'Rishikesh — Ganga Ghats',
  },
  {
    url: '/hero-slide-1.jpg',
    label: 'Nainital Lake',
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('Rishikesh');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vahanType, setVahanType] = useState('Bike');

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index, dir) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + heroSlides.length) % heroSlides.length, -1);
  }, [current, goTo]);

  // Auto-play every 4 seconds
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

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

  const isSearchDisabled = !startDate || !endDate;

  const handleSearch = () => {
    if (isSearchDisabled) return;
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (vahanType) params.set('type', vahanType);
    if (startDate) params.set('startDate', startDate.toISOString().split('T')[0]);
    if (endDate) params.set('endDate', endDate.toISOString().split('T')[0]);
    navigate(`/search?${params.toString()}`);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className="hero">
      {/* ── Slideshow background ── */}
      <div className="hero-slider">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            className="hero-slide"
            style={{ backgroundImage: `url(${heroSlides[current].url})` }}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      </div>

      {/* ── Dark overlay ── */}
      <div className="hero-overlay" />

      {/* ── Prev / Next arrows ── */}
      <button className="hero-arrow hero-arrow--left" onClick={prev} aria-label="Previous slide">
        <ChevronLeft size={28} />
      </button>
      <button className="hero-arrow hero-arrow--right" onClick={next} aria-label="Next slide">
        <ChevronRight size={28} />
      </button>

      {/* ── Dot indicators ── */}
      <div className="hero-dots">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? ' active' : ''}`}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Slide label ── */}
      <div className="hero-slide-label">{heroSlides[current].label}</div>

      {/* ── Main content ── */}
      <div className="container hero-content">
        <div className="hero-text-container">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Drive your dream across<br />Uttarakhand
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            Find the perfect vehicle for your mountain getaway.
          </motion.p>
        </div>

        <motion.div
          className="search-widget"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        >
          <div className="search-field">
            <span className="search-label">Location</span>
            <div className="search-input-wrap">
              <select
                className="search-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Rishikesh">Rishikesh</option>
                <option value="Dehradun">Dehradun</option>
                <option value="Haridwar">Haridwar</option>
                <option value="Mussoorie">Mussoorie</option>
              </select>
              <MapPin size={16} className="search-icon" />
            </div>
          </div>

          <div className="search-field">
            <span className="search-label">Start Date</span>
            <div className="search-input-wrap">
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                className="search-input"
                placeholderText="Select date"
                dateFormat="dd MMM yyyy"
                minDate={new Date()}
              />
              <Calendar size={16} className="search-icon" />
            </div>
          </div>

          <div className="search-field">
            <span className="search-label">End Date</span>
            <div className="search-input-wrap">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="search-input"
                placeholderText="Select date"
                dateFormat="dd MMM yyyy"
                minDate={getMinEndDate()}
              />
              <Calendar size={16} className="search-icon" />
            </div>
          </div>

          <div className="search-field">
            <span className="search-label">Vahan Type</span>
            <div className="search-input-wrap">
              <select
                className="search-input"
                value={vahanType}
                onChange={(e) => setVahanType(e.target.value)}
              >
                <option value="Bike">Bike &amp; Scooty</option>
                <option value="Car">Cars &amp; Cab</option>
                <option value="Activity">Activities &amp; Experiences</option>
              </select>
              <Car size={16} className="search-icon" />
            </div>
          </div>

          <button
            className="btn btn-primary search-btn"
            onClick={handleSearch}
            disabled={isSearchDisabled}
            title={isSearchDisabled ? 'Please select both start and end dates' : ''}
          >
            <Search size={18} />
            Search
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
