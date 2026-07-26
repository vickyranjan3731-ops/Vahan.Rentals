import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Compass, Heart, Users, MapPin, CheckCircle2 } from 'lucide-react';
import Callback from '../components/Callback';
import './StaticPage.css';

const stats = [
  { number: "10,000+", label: "Happy Mountain Riders" },
  { number: "150+", label: "Maintained Fleet Vehicles" },
  { number: "4.9 ★", label: "Average Customer Rating" },
  { number: "24 / 7", label: "Roadside Breakdown Help" }
];

const values = [
  { icon: <Shield size={28} />, title: "Safety First", desc: "Every bike and car undergoes rigorous multi-point mechanical inspections before handover." },
  { icon: <Compass size={28} />, title: "Freedom to Explore", desc: "All-Uttarakhand permits let you travel seamlessly from Rishikesh to Chopta, Auli & Char Dham." },
  { icon: <Award size={28} />, title: "Transparent Pricing", desc: "Zero hidden charges, clear daily rates, and instant security deposit refunds." },
  { icon: <Heart size={28} />, title: "Local Expertise", desc: "Our local team guides you with real-time weather, highway status, and scenic detour recommendations." }
];

const AboutUs = () => {
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
          <span className="static-hero-badge">Our Story & Mission</span>
          <h1>Redefining Mountain Travel in Uttarakhand</h1>
          <p>The largest and most trusted fleet of rental bikes, scooties, self-drive cars, and adventure services in Rishikesh & Dehradun.</p>
        </div>
      </div>

      <div className="static-content-container">
        {/* Stats Banner */}
        <motion.div 
          className="stats-banner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Our Story Document Card */}
        <div className="document-card">
          <div className="document-section">
            <h2><Compass className="text-primary" /> Who We Are</h2>
            <p>Founded in the heart of Rishikesh, <strong>vahan.rentals</strong> was born out of a passion for mountain freedom. We realized that travelers, backpackers, and pilgrims visiting Uttarakhand needed reliable, well-maintained vehicles and transparent rental services without hidden surprise fees.</p>
            <p>Today, we operate Uttarakhand's most modern fleet, offering top-rated Royal Enfield Himalayans, Hunter 350s, Activas, Thar 4x4s, Innova Crystas, as well as adventure experiences like White Water Rafting and Char Dham taxi packages.</p>
          </div>

          <div className="document-section">
            <h2><Award className="text-primary" /> Why Choose Vahan Rentals?</h2>
            <div className="card-grid-2" style={{ marginTop: '1rem' }}>
              {values.map((v, i) => (
                <div className="info-card" key={i}>
                  <div className="info-card-icon">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Callback />
    </motion.div>
  );
};

export default AboutUs;
