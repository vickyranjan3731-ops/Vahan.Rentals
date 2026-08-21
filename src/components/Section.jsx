import React from 'react';
import { motion } from 'framer-motion';
import VehicleCard from './VehicleCard';
import './Section.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const Section = ({ badge, title, subtitle, items, viewAllLink }) => {
  return (
    <section className="section bg-light">
      <div className="container">
        <motion.div 
          className="premium-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          {badge && (
            <div className="section-badge">
              <span className="dot"></span>
              {badge}
            </div>
          )}
          <h2 className="premium-title">{title}</h2>
          <p className="premium-subtitle">{subtitle}</p>
        </motion.div>
        
        <motion.div 
          className="cards-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {items.map((item, index) => (
            <VehicleCard key={index} {...item} />
          ))}
        </motion.div>

        {viewAllLink && (
          <div className="view-all-wrapper">
            <a 
              href={viewAllLink} 
              className="btn btn-outline view-all-btn"
              {...(viewAllLink.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              View More →
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Section;
