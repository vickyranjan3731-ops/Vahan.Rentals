import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Smile, Zap, Award, ArrowRight } from 'lucide-react';
import Callback from '../components/Callback';
import './StaticPage.css';

const jobs = [
  { title: "Fleet Operations Manager", dept: "Operations", loc: "Rishikesh, Uttarakhand", type: "Full Time", desc: "Oversee vehicle handovers, fleet maintenance schedules, and ground team coordination." },
  { title: "Customer Experience Specialist", dept: "Support", loc: "Rishikesh / Remote", type: "Full Time", desc: "Help riders plan itineraries, handle booking enquiries, and manage roadside assistance calls." },
  { title: "Senior React / Frontend Developer", dept: "Technology", loc: "Dehradun / Remote", type: "Full Time", desc: "Build modern web applications, real-time booking engines, and mobile-first UI for vahan.rentals." },
  { title: "Tour & Adventure Lead", dept: "Experiences", loc: "Rishikesh", type: "Full Time", desc: "Curate and execute raftings, camping, and Char Dham taxi tour experiences for high-end travelers." }
];

const perks = [
  { title: "Work in Rishikesh & Mountains", desc: "Say goodbye to urban traffic jams! Enjoy stunning Himalayan views and fresh mountain air every single day." },
  { title: "Free Riding & Rental Credits", desc: "Enjoy complimentary weekend rides on our top Royal Enfield bikes and Thar 4x4 fleet." },
  { title: "Competitive Pay & Growth", desc: "Industry-standard compensation, performance bonuses, and fast career progression." }
];

const Careers = () => {
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
          <span className="static-hero-badge">Join Our Team</span>
          <h1>Build the Future of Mountain Mobility</h1>
          <p>We are looking for passionate individuals who love travel, technology, and mountain adventures.</p>
        </div>
      </div>

      <div className="static-content-container">
        {/* Perks Section */}
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', marginBottom: '1rem' }}>Why Work With Us?</h2>
        <div className="card-grid-3">
          {perks.map((p, i) => (
            <div className="info-card" key={i}>
              <div className="info-card-icon"><Zap size={24} /></div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Job Listings */}
        <div style={{ marginTop: '3.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', marginBottom: '1rem' }}>Open Positions</h2>
          <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
            {jobs.map((job, i) => (
              <motion.div 
                className="info-card" 
                key={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-color)', background: 'rgba(255,122,0,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{job.dept}</span>
                    <span style={{ fontSize: '0.8rem', color: '#777' }}><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />{job.loc}</span>
                    <span style={{ fontSize: '0.8rem', color: '#777' }}>• {job.type}</span>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{job.title}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.92rem' }}>{job.desc}</p>
                </div>
                <a href="mailto:careers@vahan.rentals?subject=Application for Position" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                  Apply Now <ArrowRight size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Callback />
    </motion.div>
  );
};

export default Careers;
