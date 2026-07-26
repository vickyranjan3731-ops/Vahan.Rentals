import React from 'react';
import { motion } from 'framer-motion';
import './CarsHero.css';

const CarsHero = () => {
  return (
    <div className="cars-hero">
      <div className="cars-hero-overlay"></div>
      <div className="container cars-hero-content">
        <motion.div 
          className="cars-hero-text"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="hero-badge">OUTSTATION TRAVEL</div>
          <h1 className="hero-title">Explore in<br/>Comfort.</h1>
          <p className="hero-subtitle">
            Experience the joy of an uninterrupted journey<br/>
            through beautiful mountain passes in premium SUVs.
          </p>
          <button className="btn btn-primary btn-large mt-4">Book Now</button>
        </motion.div>
        
        <motion.div 
          className="cars-hero-image"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* We will use a high quality car image on a transparent background */}
          <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Premium SUV" className="hero-car-img" />
        </motion.div>
      </div>
    </div>
  );
};

export default CarsHero;
