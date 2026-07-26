import React from 'react';
import { PhoneCall, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './Callback.css';

const Callback = () => {
  return (
    <section className="callback-section">
      <div className="container">
        <div className="callback-card-wrapper">
          <motion.div 
            className="callback-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="contact-icon-wrap">
              <PhoneCall size={32} />
            </div>
            <h3 className="contact-title">We're Available</h3>
            <p className="contact-subtitle">Mon - Sun · 7 AM - 10 PM</p>
            <h4 className="contact-phone">+91 70605 12661</h4>
          </motion.div>

          <motion.div 
            className="callback-right"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="callback-header">
              <span className="callback-badge">NEED HELP?</span>
              <h2 className="callback-title">Request a Callback</h2>
              <p className="callback-desc">
                Fill in your details and our booking travel desk will call you back within 10 minutes to confirm your ride requirements.
              </p>
            </div>
            
            <form className="callback-form" onSubmit={(e) => e.preventDefault()}>
              <div className="callback-form-row">
                <div className="callback-form-group">
                  <label>YOUR NAME</label>
                  <input type="text" placeholder="Enter Name" />
                </div>
                <div className="callback-form-group">
                  <label>PHONE NUMBER</label>
                  <input type="tel" placeholder="+91 70605 12661" />
                </div>
              </div>
              
              <div className="callback-form-row">
                <div className="callback-form-group">
                  <label>INTERESTED IN</label>
                  <select defaultValue="Bike Rental">
                    <option value="Bike Rental">Bike Rental</option>
                    <option value="Car Rental">Car Rental</option>
                    <option value="Taxi Service">Taxi Service</option>
                    <option value="Experiences">Experiences / Sightseeing</option>
                  </select>
                </div>
                <div className="callback-form-group">
                  <label>PREFERRED TIME</label>
                  <select defaultValue="As soon as possible">
                    <option value="As soon as possible">As soon as possible</option>
                    <option value="Morning">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening">Evening (4 PM - 8 PM)</option>
                  </select>
                </div>
              </div>
              
              <div className="callback-form-group full-width">
                <label>MESSAGE (OPTIONAL)</label>
                <textarea placeholder="Any specific questions about pickup, drop-off outside normal hours, etc..." rows={2}></textarea>
              </div>
              
              <div className="callback-form-actions">
                <button type="submit" className="btn btn-primary callback-submit-btn">Request Callback</button>
                <div className="callback-assurance">
                  <span><CheckCircle2 size={14} className="inline-icon" /> Callback in 10 mins average</span>
                  <span><CheckCircle2 size={14} className="inline-icon" /> 24/7 Breakdown Assistance included</span>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Callback;
