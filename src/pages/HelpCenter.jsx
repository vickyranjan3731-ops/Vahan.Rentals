import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, CreditCard, ShieldCheck, Wrench, ChevronDown, ChevronUp, PhoneCall, FileText } from 'lucide-react';
import Callback from '../components/Callback';
import './StaticPage.css';

const helpCategories = [
  { icon: <HelpCircle size={24} />, title: "Booking & Reservations", desc: "How to book bikes, scooties, or taxis online in Rishikesh & Dehradun." },
  { icon: <CreditCard size={24} />, title: "Payments & Security Deposit", desc: "Accepted payment options, security deposit rules, and instant refund timelines." },
  { icon: <ShieldCheck size={24} />, title: "Documents Required", desc: "Driving license validation, ID verification, and international rider rules." },
  { icon: <Wrench size={24} />, title: "Roadside Assistance", desc: "24/7 breakdown support, flat tire help, and roadside mechanics." },
  { icon: <FileText size={24} />, title: "Cancellation & Refunds", desc: "Instant cancellation requests and refund calculation policies." },
  { icon: <PhoneCall size={24} />, title: "Contact Support Desk", desc: "Direct phone line, WhatsApp support, and pickup point locations." }
];

const faqs = [
  { q: "What documents do I need to rent a bike or scooty?", a: "You need a valid original Driving License (DL) and a government ID proof (Aadhar Card, Passport, or Voter ID). International tourists require an International Driving Permit (IDP)." },
  { q: "Is fuel included in the vehicle rental price?", a: "Vehicles are provided with sufficient fuel to reach the nearest fuel station. You need to return the vehicle with the same fuel level as provided at handover." },
  { q: "How is the security deposit refunded?", a: "The security deposit is refunded immediately upon returning the vehicle in good condition without damage or unpaid traffic challans." },
  { q: "Can I take the bike outside Rishikesh (e.g. Chopta, Auli, Badrinath)?", a: "Yes! All our bikes and taxis come with all-Uttarakhand permits. Please notify our desk at pickup for high-altitude routes." },
  { q: "What happens in case of a breakdown or flat tire?", a: "We provide 24/7 Roadside Assistance across Rishikesh, Haridwar, and Dehradun. Simply call our support helpline at +91 70605 12661." }
];

const HelpCenter = () => {
  const [openFaq, setOpenFaq] = useState(0);

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
          <span className="static-hero-badge">Help & Customer Support</span>
          <h1>How can we help you today?</h1>
          <p>Search our knowledge base or browse popular support categories below.</p>
        </div>
      </div>

      <div className="static-content-container">
        {/* Support Categories */}
        <motion.div 
          className="card-grid-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {helpCategories.map((cat, i) => (
            <div className="info-card" key={i}>
              <div className="info-card-icon">{cat.icon}</div>
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* FAQs */}
        <motion.div 
          className="document-card"
          style={{ marginTop: '3rem' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="document-section">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions about rentals, documentation, and policies.</p>
            
            <div className="faqs-list" style={{ marginTop: '1.5rem' }}>
              {faqs.map((faq, i) => (
                <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i} style={{ marginBottom: '1rem' }}>
                  <div 
                    className="faq-question" 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600' }}
                  >
                    <span>{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div 
                        className="faq-answer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ padding: '1rem', color: '#555', lineHeight: '1.6' }}
                      >
                        <p>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <Callback />
    </motion.div>
  );
};

export default HelpCenter;
