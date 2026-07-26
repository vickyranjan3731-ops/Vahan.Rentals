import React from 'react';
import { Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './BikeCard.css';

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4 }
  }
};

const BikeCard = ({ id, image, title, price, rating, reviews, location }) => {
  return (
    <motion.div variants={itemVariants} style={{ width: '100%' }}>
      <Link to={`/vehicle/${id}`} className="bike-card-link">
        <div className="bike-card">
          <div className="bike-card-image-wrap">
            <img src={image} alt={title} className="bike-card-image" />
            <button className="favorite-btn" onClick={(e) => {
              e.preventDefault(); // prevent navigation when clicking favorite
            }}>
              <Heart size={18} />
            </button>
          </div>
          
          <div className="bike-card-content">
            <div className="bike-card-title-row">
              <h3 className="bike-card-title">{title}</h3>
              <div className="bike-rating-pill">
                <Star size={13} fill="#f59e0b" color="#f59e0b" />
                <span>{rating} <span className="review-count">({reviews})</span></span>
              </div>
            </div>
            
            <p className="bike-location">{location}</p>
            
            <p className="bike-price">
              <span className="price-amount">{price}</span><span className="price-suffix">/day</span>
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BikeCard;
