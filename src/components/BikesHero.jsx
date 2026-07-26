import React from 'react';
import { motion } from 'framer-motion';
import './BikesHero.css';

const BikesHero = () => {
  return (
    <div className="bikes-hero">
      <div className="container bikes-hero-content">
        <motion.div 
          className="bikes-hero-text"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="hero-badge">TWO WHEELER RENTALS</div>
          <h1 className="hero-title">Explore on<br/>Two Wheels.</h1>
          <p className="hero-subtitle">
            Experience the thrill of the open road and<br/>
            feel the mountain breeze on our premium bikes.
          </p>
          <button className="btn btn-primary btn-large mt-4">Book Now</button>
        </motion.div>
        
        <motion.div 
          className="bikes-hero-image"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* Royal Enfield Himalayan Image */}
          <img src="/Himalayan.jpg" alt="Royal Enfield Himalayan" className="hero-bike-img" />
        </motion.div>
      </div>
    </div>
  );
};

export default BikesHero;
