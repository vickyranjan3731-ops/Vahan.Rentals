import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import BikeCard from './BikeCard';
import './BikeListingSection.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

import { bikeData } from '../data';
const BikeListingSection = () => {
  return (
    <section className="bike-listing-section">
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
            Find the perfect two-wheeler for your Uttarakhand adventure. Whether you crave the thrill of the mountains or a smooth city cruise, we have you covered.
          </p>
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
            <input type="text" placeholder="Search by bike model, location, or CC..." />
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
              <h4 className="filter-title">Bike Type</h4>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> Cruiser (4)
              </label>
              <label className="checkbox-label">
                <input type="checkbox" /> Adventure (3)
              </label>
              <label className="checkbox-label">
                <input type="checkbox" /> Sports (5)
              </label>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> Scooter (6)
              </label>
            </div>

            <div className="filter-group">
              <h4 className="filter-title">Engine Capacity</h4>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> Up to 150cc (8)
              </label>
              <label className="checkbox-label">
                <input type="checkbox" /> 150cc - 300cc (5)
              </label>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> 300cc & Above (3)
              </label>
            </div>
            
            <div className="filter-group">
              <h4 className="filter-title">Price per Day</h4>
              <input type="range" className="price-slider" min="400" max="3000" />
              <div className="price-labels">
                <span>₹400</span>
                <span>₹3,000+</span>
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
              {bikeData.map((bike, index) => (
                <BikeCard key={index} {...bike} />
              ))}
            </motion.div>
            <div className="load-more-wrap">
              <button className="load-more-btn">
                Load More Bikes
                <ChevronDown size={18} className="load-more-icon" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BikeListingSection;
