import React from 'react';
import { CheckCircle, Shield, Clock, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import './FleetStandards.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FleetStandards = () => {
  return (
    <section className="fleet-standards">
      <div className="container">
        
        <motion.div 
          className="premium-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="premium-title">Our Premium <span>Fleet Standards</span></h2>
          <p className="premium-subtitle">
            We maintain our vehicles to the highest standards so you can focus on the journey.
          </p>
        </motion.div>

        <motion.div 
          className="standards-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          
          <motion.div className="standard-item" variants={itemVariants}>
            <div className="standard-icon-wrap">
              <CheckCircle size={28} className="text-primary" />
            </div>
            <h4 className="standard-title">Premium Sedans & SUVs</h4>
            <p className="standard-desc">
              Choose from a curated selection of top-tier vehicles designed for ultimate comfort and style.
            </p>
          </motion.div>

          <motion.div className="standard-item" variants={itemVariants}>
            <div className="standard-icon-wrap">
              <Shield size={28} className="text-primary" />
            </div>
            <h4 className="standard-title">Well Maintained</h4>
            <p className="standard-desc">
              Every vehicle undergoes a rigorous 50-point inspection before it is handed over to you.
            </p>
          </motion.div>

          <motion.div className="standard-item" variants={itemVariants}>
            <div className="standard-icon-wrap">
              <Clock size={28} className="text-primary" />
            </div>
            <h4 className="standard-title">On-Time Delivery</h4>
            <p className="standard-desc">
              We value your time. Enjoy prompt doorstep delivery and pick-up services at your convenience.
            </p>
          </motion.div>

          <motion.div className="standard-item" variants={itemVariants}>
            <div className="standard-icon-wrap">
              <ThumbsUp size={28} className="text-primary" />
            </div>
            <h4 className="standard-title">Sanitized Interiors</h4>
            <p className="standard-desc">
              Your safety is our priority. Our cars are deeply sanitized after every single trip.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default FleetStandards;
