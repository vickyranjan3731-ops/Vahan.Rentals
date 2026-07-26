import React from 'react';
import { UserCheck, IndianRupee, Sparkles, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import './CabAdvantages.css';

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

const CabAdvantages = () => {
  return (
    <section className="cab-advantages">
      <div className="container">
        
        <motion.div 
          className="premium-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="premium-title">Vahan <span>Cab Advantages</span></h2>
          <p className="premium-subtitle">
            Enjoy premium amenities and unparalleled service on every outstation journey.
          </p>
        </motion.div>

        <motion.div 
          className="advantages-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          
          <motion.div className="advantage-card" variants={itemVariants}>
            <div className="adv-icon">
              <UserCheck size={24} className="text-primary" />
            </div>
            <h4 className="adv-title">Experienced Chauffeurs</h4>
            <p className="adv-desc">
              Vetted, highly experienced drivers who know the challenging mountain terrains like the back of their hand.
            </p>
          </motion.div>

          <motion.div className="advantage-card" variants={itemVariants}>
            <div className="adv-icon">
              <IndianRupee size={24} className="text-primary" />
            </div>
            <h4 className="adv-title">Transparent Pricing</h4>
            <p className="adv-desc">
              Clear billing with zero hidden charges. What you see during booking is exactly what you pay.
            </p>
          </motion.div>

          <motion.div className="advantage-card" variants={itemVariants}>
            <div className="adv-icon">
              <Sparkles size={24} className="text-primary" />
            </div>
            <h4 className="adv-title">Immaculate Cleanliness</h4>
            <p className="adv-desc">
              Experience the fresh car smell every time. Deep interior vacuuming and sanitization prior to every trip.
            </p>
          </motion.div>

          <motion.div className="advantage-card" variants={itemVariants}>
            <div className="adv-icon">
              <Map size={24} className="text-primary" />
            </div>
            <h4 className="adv-title">24/7 Roadtrip Assistance</h4>
            <p className="adv-desc">
              Dedicated on-call support team ready to assist you anywhere, anytime during your Uttarakhand journey.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default CabAdvantages;
