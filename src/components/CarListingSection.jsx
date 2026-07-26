import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import CarCard from './CarCard';
import { carData } from '../data';
import './CarListingSection.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const CarListingSection = () => {
  const [driveMode, setDriveMode] = useState('self'); // 'self' or 'chauffeur'

  return (
    <section className="car-listing-section">
      <div className="container">
        
        <motion.div 
          className="premium-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-badge">
            <span className="dot"></span>
            OUR PREMIUM FLEET
          </div>
          <h2 className="premium-title">Choose Your <span>Perfect Ride</span></h2>
          <p className="premium-subtitle">
            Tailor-made options for a comfortable and scenic journey across Uttarakhand.
          </p>
        </motion.div>

        {/* Toggle Switch */}
        <motion.div 
          className="drive-toggle-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="drive-toggle">
            <button 
              className={`toggle-btn ${driveMode === 'self' ? 'active' : ''}`}
              onClick={() => setDriveMode('self')}
            >
              Self Drive Options
            </button>
            <button 
              className={`toggle-btn ${driveMode === 'chauffeur' ? 'active' : ''}`}
              onClick={() => setDriveMode('chauffeur')}
            >
              Chauffeur Driven
            </button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="listing-search-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="listing-search">
            <Search size={18} className="text-gray" />
            <input type="text" placeholder="Search by car model, location, or features..." />
            <button className="btn btn-primary search-action-btn">Search</button>
          </div>
        </motion.div>

        <div className="listing-layout">
          {/* Sidebar Filters */}
          <motion.aside 
            className="listing-sidebar"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="filter-group">
              <h4 className="filter-title">Car Type</h4>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> SUV (5)
              </label>
              <label className="checkbox-label">
                <input type="checkbox" /> Sedan (3)
              </label>
              <label className="checkbox-label">
                <input type="checkbox" /> Hatchback (2)
              </label>
              <label className="checkbox-label">
                <input type="checkbox" /> MUV / MPV (4)
              </label>
            </div>

            <div className="filter-group">
              <h4 className="filter-title">Transmission</h4>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> Automatic (8)
              </label>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> Manual (6)
              </label>
            </div>
            
            <div className="filter-group">
              <h4 className="filter-title">Price Range</h4>
              <input type="range" className="price-slider" min="1000" max="15000" />
              <div className="price-labels">
                <span>₹1,000</span>
                <span>₹15,000+</span>
              </div>
            </div>
          </motion.aside>

          {/* Main Grid */}
          <div className="listing-main">
            <motion.div 
              className="listing-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {carData.map((car, index) => (
                <CarCard key={index} {...car} />
              ))}
            </motion.div>
            
            <div className="load-more-wrap text-center">
              <button className="btn btn-outline btn-large">Load More Vehicles</button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CarListingSection;
