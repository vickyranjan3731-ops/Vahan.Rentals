import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import Callback from '../components/Callback';
import './StaticPage.css';

const posts = [
  {
    title: "Top 10 Scenic Bike Routes from Rishikesh to Chopta & Auli",
    category: "Riding Guides",
    date: "July 12, 2026",
    author: "Rohan Sharma",
    img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    desc: "Discover breathtaking mountain passes, hairpin curves, and scenic stopovers on your Himalayan motorcycle adventure."
  },
  {
    title: "Everything You Need to Know Before Planning Char Dham Yatra 2026",
    category: "Char Dham Special",
    date: "July 05, 2026",
    author: "Pooja Verma",
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    desc: "Complete guide on taxi hire rates, route weather conditions, registration steps, and luxury SUV recommendations."
  },
  {
    title: "Rafting in Rishikesh: Complete Guide to Rapids, Prices & Best Season",
    category: "Adventure",
    date: "June 28, 2026",
    author: "Vikram Singh",
    img: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80",
    desc: "From Shivpuri 16 KM rapids to Marine Drive 26 KM stretches, here is how to book certified guides and equipment."
  },
  {
    title: "Mahindra Thar 4x4 vs Himalayan 450: Which Vehicle Suits Mountain Roads?",
    category: "Vehicle Comparison",
    date: "June 15, 2026",
    author: "Technical Desk",
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    desc: "Comparing off-road suspension, ground clearance, luggage space, and fuel economy on steep Uttarakhand mountain roads."
  }
];

const Blog = () => {
  return (
    <motion.div 
      className="static-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="static-hero">
        <div className="container">
          <span className="static-hero-badge">Travel & Riding Stories</span>
          <h1>Uttarakhand Travel Guide & Riding Blog</h1>
          <p>Expert tips, mountain route guides, weather updates, and itinerary recommendations for your Rishikesh trip.</p>
        </div>
      </div>

      <div className="static-content-container">
        <div className="card-grid-2">
          {posts.map((post, i) => (
            <motion.div 
              className="blog-card" 
              key={i}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <img src={post.img} alt={post.title} className="blog-card-img" />
              <div className="blog-card-body">
                <span className="blog-card-tag">{post.category}</span>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-desc">{post.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#888', paddingTop: '0.75rem', borderTop: '1px solid #f0f0f0' }}>
                  <span><Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />{post.date}</span>
                  <span style={{ color: 'var(--primary-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read Story <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Callback />
    </motion.div>
  );
};

export default Blog;
