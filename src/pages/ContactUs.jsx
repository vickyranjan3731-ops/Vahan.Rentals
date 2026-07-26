import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import Callback from '../components/Callback';
import './StaticPage.css';

const contactDetails = [
  { icon: <PhoneCall size={24} />, title: "Phone Support", info: "+91 70605 12661", sub: "Mon - Sun: 7 AM - 10 PM" },
  { icon: <Mail size={24} />, title: "Email Enquiries", info: "info@vahan.rentals", sub: "24/7 Desk Support Response" },
  { icon: <MapPin size={24} />, title: "Main Pickup Station", info: "Tapovan Main Highway, Near Badrinath Road", sub: "Rishikesh, Uttarakhand - 249192" },
  { icon: <Clock size={24} />, title: "Operating Hours", info: "7:00 AM - 10:00 PM Daily", sub: "24/7 Roadside Assistance Active" }
];

const ContactUs = () => {
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
          <span className="static-hero-badge">Get In Touch</span>
          <h1>Contact Vahan Rentals Desk</h1>
          <p>Have questions about bike rentals, car hire rates, or tour packages in Rishikesh? Reach out to our local team.</p>
        </div>
      </div>

      <div className="static-content-container">
        {/* Contact Info Cards */}
        <div className="card-grid-2">
          {contactDetails.map((c, i) => (
            <div className="info-card" key={i}>
              <div className="info-card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p style={{ fontWeight: '700', color: '#111', fontSize: '1.05rem', margin: '0.25rem 0' }}>{c.info}</p>
              <p style={{ fontSize: '0.85rem', color: '#777' }}>{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Contact Form Card */}
        <div className="document-card" style={{ marginTop: '3rem' }}>
          <div className="document-section">
            <h2><MessageSquare className="text-primary" /> Send Us a Message</h2>
            <p>Fill out your trip details below and our team will get back to you within 15 minutes.</p>

            <form style={{ display: 'grid', gap: '1.25rem', marginTop: '1.5rem' }} onSubmit={(e) => e.preventDefault()}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: '#444' }}>YOUR NAME</label>
                  <input type="text" placeholder="Enter Full Name" style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: '#444' }}>PHONE NUMBER</label>
                  <input type="tel" placeholder="+91 Mobile Number" style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: '#444' }}>EMAIL ADDRESS</label>
                <input type="email" placeholder="name@example.com" style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: '#444' }}>YOUR MESSAGE / ENQUIRY</label>
                <textarea rows={4} placeholder="Tell us about your rental dates, preferred vehicle (Bike/Scooty/Car), or travel plans..." style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit' }}></textarea>
              </div>

              <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1rem', fontWeight: '700' }}>
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <Callback />
    </motion.div>
  );
};

export default ContactUs;
