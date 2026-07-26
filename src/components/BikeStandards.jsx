import React from 'react';
import { ShieldAlert, Wrench, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import './BikeStandards.css';

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

const BikeStandards = () => {
  return (
    <section className="bike-standards">
      <div className="container">
        
        <motion.div 
          className="premium-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="premium-title">Our Premium <span>Bike Standards</span></h2>
          <p className="premium-subtitle">
            Safety and performance are our top priorities for your mountain adventure.
          </p>
        </motion.div>

        <motion.div 
          className="bike-standards-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          
          <motion.div className="bike-standard-item" variants={itemVariants}>
            <div className="bike-standard-icon-wrap">
              <ShieldAlert size={28} className="text-primary" />
            </div>
            <h4 className="bike-standard-title">Complimentary Helmets</h4>
            <p className="bike-standard-desc">
              Every rental comes with two high-quality, sanitized helmets for rider and pillion safety.
            </p>
          </motion.div>

          <motion.div className="bike-standard-item" variants={itemVariants}>
            <div className="bike-standard-icon-wrap">
              <Wrench size={28} className="text-primary" />
            </div>
            <h4 className="bike-standard-title">Thoroughly Serviced</h4>
            <p className="bike-standard-desc">
              Brakes, clutch, and tyres are rigorously checked and serviced before every single rental.
            </p>
          </motion.div>

          <motion.div className="bike-standard-item" variants={itemVariants}>
            <div className="bike-standard-icon-wrap">
              <Clock size={28} className="text-primary" />
            </div>
            <h4 className="bike-standard-title">Instant Handover</h4>
            <p className="bike-standard-desc">
              Minimal paperwork. Get the keys and hit the road within 10 minutes of arrival.
            </p>
          </motion.div>

          <motion.div className="bike-standard-item" variants={itemVariants}>
            <div className="bike-standard-icon-wrap">
              <Heart size={28} className="text-primary" />
            </div>
            <h4 className="bike-standard-title">Sanitized Grips</h4>
            <p className="bike-standard-desc">
              Handlebars, seats, and helmets are deeply sanitized to ensure maximum hygiene.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default BikeStandards;
