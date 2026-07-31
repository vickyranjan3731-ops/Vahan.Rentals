import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('Rishikesh');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vahanType, setVahanType] = useState('Bike');

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

  return (
    <div className="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <div className="hero-text-container">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Drive your dream across<br/>Uttarakhand
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Find the perfect vehicle for your mountain getaway.
          </motion.p>
        </div>
        
        <motion.div 
          className="search-widget"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
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
                <option value="Bike">Bike & Scooty</option>
                <option value="Car">Cars & Cab</option>
                <option value="Activity">Activities & Experiences</option>
              </select>
              <Car size={16} className="search-icon" />
            </div>
          </div>
          
          <button 
            className="btn btn-primary search-btn"
            onClick={handleSearch}
            disabled={isSearchDisabled}
            title={isSearchDisabled ? "Please select both start and end dates" : ""}
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
