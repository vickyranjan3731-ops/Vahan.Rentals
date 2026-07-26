import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Navigation2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AppFeature.css';

const AppFeature = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const secondaryImages = ['/honda.jpg', '/blue_activa.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % secondaryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="app-feature">
      <div className="container app-feature-container">
        
        <motion.div 
          className="app-image-wrap"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="scenic-collage">
            <img src="/Himalayan.jpg" alt="Royal Enfield Himalayan" className="collage-main-img" />
            <div className="collage-sub-img">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  src={secondaryImages[currentImageIndex]} 
                  alt="Honda Activa Scooter" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                />
              </AnimatePresence>
            </div>
            <div className="collage-badge">
              <span className="badge-number">100+</span>
              <span className="badge-text">Scenic Routes</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="app-content"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="section-title text-left">Explore Scenic Yatra Corridors</h2>
          <p className="section-subtitle text-left mb-5">
            Discover the most beautiful and spiritual routes across Uttarakhand with our expertly curated guides.
          </p>

          <div className="feature-list">
            <div className="feature-list-item">
              <div className="feature-bullet">
                <MapPin size={20} className="text-primary" />
              </div>
              <div className="feature-text">
                <h4>Holy Towns & Char Dham Stops</h4>
                <p>Easily navigate to Badrinath, Kedarnath, Gangotri, and Yamunotri with pre-planned safe routes.</p>
              </div>
            </div>

            <div className="feature-list-item">
              <div className="feature-bullet">
                <Navigation size={20} className="text-primary" />
              </div>
              <div className="feature-text">
                <h4>Mountain Passes & Thrilling Loops</h4>
                <p>Find the best driving roads, hidden scenic spots, and viewpoints for an unforgettable road trip.</p>
              </div>
            </div>

            <div className="feature-list-item">
              <div className="feature-bullet">
                <Navigation2 size={20} className="text-primary" />
              </div>
              <div className="feature-text">
                <h4>Real-time Road Updates & Warnings</h4>
                <p>Stay informed about landslides, roadblocks, and weather conditions for a safe mountain drive.</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AppFeature;
