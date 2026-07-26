import React from 'react';
import { IndianRupee, MapPin, Fuel, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import './BikeAdvantages.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

const BikeAdvantages = () => {
  return (
    <section className="bike-advantages">
      <div className="container">
        
        <motion.div 
          className="premium-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="premium-title">Why Rent a <span>Two-Wheeler?</span></h2>
          <p className="premium-subtitle">
            Discover the unparalleled benefits of exploring the mountains on a bike.
          </p>
        </motion.div>

        <motion.div 
          className="bike-adv-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          
          <motion.div className="bike-adv-card" variants={itemVariants}>
            <div className="bike-adv-icon">
              <MapPin size={24} className="text-primary" />
            </div>
            <h4 className="bike-adv-title">Easy Parking</h4>
            <p className="bike-adv-desc">
              Navigate narrow mountain roads and find parking effortlessly even in crowded tourist spots like Mall Road.
            </p>
          </motion.div>

          <motion.div className="bike-adv-card" variants={itemVariants}>
            <div className="bike-adv-icon">
              <Fuel size={24} className="text-primary" />
            </div>
            <h4 className="bike-adv-title">High Fuel Efficiency</h4>
            <p className="bike-adv-desc">
              Save significantly on fuel costs. Our bikes and scooties deliver excellent mileage on hilly terrains.
            </p>
          </motion.div>

          <motion.div className="bike-adv-card" variants={itemVariants}>
            <div className="bike-adv-icon">
              <Compass size={24} className="text-primary" />
            </div>
            <h4 className="bike-adv-title">Unrestricted Freedom</h4>
            <p className="bike-adv-desc">
              Stop anywhere for a photo, feel the fresh mountain air, and experience the landscape without barriers.
            </p>
          </motion.div>

          <motion.div className="bike-adv-card" variants={itemVariants}>
            <div className="bike-adv-icon">
              <IndianRupee size={24} className="text-primary" />
            </div>
            <h4 className="bike-adv-title">Highly Affordable</h4>
            <p className="bike-adv-desc">
              The most budget-friendly way to travel. Rent a reliable two-wheeler starting at just ₹400/day.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default BikeAdvantages;
