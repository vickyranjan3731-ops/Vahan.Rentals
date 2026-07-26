import React from 'react';
import { Users, Settings, Briefcase, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './CarCard.css';

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4 }
  }
};

const CarCard = ({ id, image, category, badge, title, passengers, transmission, luggage, price, rating }) => {
  const cardContent = (
    <motion.div 
      className="car-card" 
      variants={itemVariants}
      whileHover={{ y: -8, boxShadow: '0 20px 30px rgba(0, 0, 0, 0.12)', transition: { duration: 0.25 } }}
    >
      <div className="car-card-image-wrap">
        <motion.img 
          src={image} 
          alt={title} 
          className="car-card-image"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <div className="car-card-content">
        <div className="car-card-header">
          <span className="car-category text-primary font-bold">{category}</span>
          {badge && <span className="car-badge badge-primary">{badge}</span>}
        </div>
        
        <h3 className="car-card-title">{title}</h3>
        
        <div className="car-features">
          <div className="car-feature">
            <Users size={14} className="text-primary" />
            <span>{passengers} Seats</span>
          </div>
          <div className="car-feature">
            <Settings size={14} className="text-primary" />
            <span>{transmission}</span>
          </div>
          {luggage && (
            <div className="car-feature">
              <Briefcase size={14} className="text-primary" />
              <span>{luggage} Bags</span>
            </div>
          )}
        </div>
        
        <div className="car-card-footer">
          <div className="car-price-wrap">
            <p className="car-price-label">Starting from</p>
            <p className="car-price">
              <span className="price-amount">{price}</span> <span className="text-sm">/day</span>
            </p>
          </div>
          <div className="car-rating-wrap">
            <Star size={16} fill="var(--primary-color)" color="var(--primary-color)" />
            <span className="car-rating">{rating}</span>
          </div>
        </div>
        
        <motion.button 
          className="btn btn-primary btn-full mt-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );

  if (id) {
    return (
      <Link to={`/vehicle/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default CarCard;
