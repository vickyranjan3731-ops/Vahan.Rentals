import React from 'react';
import { Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import './BikeScenicFeature.css';

const BikeScenicFeature = () => {
  return (
    <section className="bike-scenic-feature">
      <div className="container">
        
        <motion.div 
          className="premium-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-badge">
            <Wind size={14} />
            <span>FEEL THE HIMALAYAS</span>
          </div>
          <h2 className="premium-title">Feel the Wind on Untamed <span>Mountain Passes</span></h2>
        </motion.div>

        <div className="bike-scenic-container">
          <motion.div 
            className="bike-scenic-content"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
          <p className="bike-scenic-desc">
            Nothing beats the thrill of riding a motorcycle through the winding roads of Uttarakhand. Our bikes are meticulously maintained to handle steep inclines and sharp mountain curves with ease.
          </p>
          <p className="bike-scenic-desc">
            Whether you're planning an adventurous trip to Chopta or a spiritual ride to Kedarnath, we have the perfect two-wheeler for your journey.
          </p>
          
          <a href="#" className="bike-scenic-link">Explore our rider's routes →</a>
        </motion.div>

        <motion.div 
          className="bike-scenic-image-wrap"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src="/Himalayan.jpg" alt="Scenic bike ride" className="bike-scenic-image" />
          <div className="bike-scenic-overlay-card">
            <h4>An Adventurer's Dream</h4>
            <p>Experience the ultimate freedom on two wheels.</p>
          </div>
        </motion.div>
        </div>

      </div>
    </section>
  );
};

export default BikeScenicFeature;
