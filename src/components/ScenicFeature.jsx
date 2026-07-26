import React from 'react';
import { Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import './ScenicFeature.css';

const ScenicFeature = () => {
  return (
    <section className="scenic-feature">
      <div className="container scenic-container">
        
        <motion.div 
          className="scenic-content"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="hiw-badge mb-4">
            <Compass size={14} />
            <span>DISCOVER UTTARAKHAND</span>
          </div>
          <h2 className="scenic-title">Traverse Holy Passes<br/>in Supreme Cabin<br/>Sanctuary</h2>
          <p className="scenic-desc">
            Explore Rishikesh and the Himalayan foothills in unparalleled comfort. Our premium SUVs and sedans are meticulously maintained to ensure a smooth journey on challenging mountain roads.
          </p>
          <p className="scenic-desc">
            Whether you are heading for a spiritual retreat in Badrinath or a relaxing weekend in Mussoorie, we provide the perfect vehicle tailored for your mountain getaway.
          </p>
          
          <a href="#" className="scenic-link">Explore our outstation routes →</a>
        </motion.div>

        <motion.div 
          className="scenic-image-wrap"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Scenic drive" className="scenic-image" />
          <div className="scenic-overlay-card">
            <h4>A Unique Experience</h4>
            <p>Your journey is as important as the destination.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ScenicFeature;
