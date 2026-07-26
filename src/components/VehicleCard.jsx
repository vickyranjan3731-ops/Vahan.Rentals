import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './VehicleCard.css';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const VehicleCard = ({ id, image, title, location, price, rating, reviews, objectFit = 'cover' }) => {
  const cardContent = (
    <motion.div 
      className="vehicle-card" 
      variants={itemVariants}
      whileHover={{ y: -8, boxShadow: '0 20px 30px rgba(0, 0, 0, 0.12)', transition: { duration: 0.25 } }}
    >
      <div className="card-image-wrap">
        <motion.img 
          src={image} 
          alt={title} 
          className="card-image" 
          style={{ objectFit }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <motion.button 
          className="like-btn"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            if (id) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <Heart size={20} />
        </motion.button>
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          <div className="card-rating">
            <span className="star">★</span> {rating} ({reviews})
          </div>
        </div>
        <p className="card-location">{location}</p>
        <p className="card-price">
          <span className="price-amount">{price}</span>/day
        </p>
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

export default VehicleCard;
