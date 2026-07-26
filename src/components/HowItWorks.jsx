import React from 'react';
import { Sparkles, Search, CalendarCheck, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <div className="container">
        <div className="hiw-header text-center">
          <div className="hiw-badge">
            <Sparkles size={14} />
            <span>SEAMLESS BOOKING FLOW</span>
          </div>
          <h2 className="hiw-title">
            Rent in <span className="text-primary">3 Simple Steps</span>
          </h2>
          <p className="hiw-subtitle">
            Getting behind the wheel has never been quicker. Explore,<br/>book, and hit the highway in minutes.
          </p>
        </div>

        <div className="steps-container">
          {/* Connecting Line */}
          <div className="steps-line"></div>

          {/* Step 1 */}
          <motion.div 
            className="step-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="step-number badge-dark">STEP 01</div>
            <div className="step-icon-wrap icon-light">
              <Search className="step-icon text-primary" size={28} />
            </div>
            <h3 className="step-title">Explore Collections</h3>
            <p className="step-desc">
              Browse our curated collection of verified premium cars, touring bikes, and dynamic scooties across Uttarakhand hubs.
            </p>
            <div className="step-indicator"></div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            className="step-card step-card-active"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="step-number badge-primary">STEP 02</div>
            <div className="step-icon-wrap icon-primary">
              <CalendarCheck className="step-icon text-white" size={32} />
            </div>
            <h3 className="step-title">Reserve Instantly</h3>
            <p className="step-desc">
              Select your preferred dates, add customization options, and book securely with a minimal advance payment or deposit.
            </p>
            <div className="step-indicator-active"></div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            className="step-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="step-number badge-dark">STEP 03</div>
            <div className="step-icon-wrap icon-light">
              <Key className="step-icon text-primary" size={28} />
            </div>
            <h3 className="step-title">Key Pick & Drive</h3>
            <p className="step-desc">
              Pick up your pristine keys from our central Laxman Jhula hub, or choose premium, hassle-free doorstep home delivery.
            </p>
            <div className="step-indicator"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
