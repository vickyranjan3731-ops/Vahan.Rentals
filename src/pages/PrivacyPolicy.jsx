import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, Server, Shield, Smartphone, UserCheck } from 'lucide-react';
import Callback from '../components/Callback';
import './StaticPage.css';

const PrivacyPolicy = () => {
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
          <span className="static-hero-badge">Data Protection</span>
          <h1>Privacy Policy</h1>
          <p>We respect your privacy and are committed to protecting your personal information.</p>
        </div>
      </div>

      <div className="static-content-container">
        <div className="document-card">
          <div className="document-section">
            <h2><Lock className="text-primary" /> 1. Information We Collect</h2>
            <p>When you register, book a vehicle, or request a callback on Vahan Rentals, we collect personal information necessary to deliver our services:</p>
            <ul>
              <li>Contact Information: Name, phone number, email address.</li>
              <li>Verification Documents: Copy of Driving License, Aadhar Card / Passport for identity verification.</li>
              <li>Booking Details: Vehicle preferences, rental dates, pickup & drop-off locations.</li>
            </ul>
          </div>

          <div className="document-section">
            <h2><Eye className="text-primary" /> 2. How We Use Your Data</h2>
            <p>Your personal data is used solely for the following purposes:</p>
            <ul>
              <li>Fulfilling vehicle rental reservations and confirming booking details via SMS/WhatsApp.</li>
              <li>Verifying legal eligibility to operate motor vehicles under Indian law.</li>
              <li>Providing emergency roadside assistance and tracking vehicle safety.</li>
              <li>Improving customer experience and sending occasional promotional updates (optional).</li>
            </ul>
          </div>

          <div className="document-section">
            <h2><Server className="text-primary" /> 3. Data Security & Storage</h2>
            <p>We employ industry-standard 256-bit SSL encryption to safeguard your data against unauthorized access, loss, or disclosure. Payment transactions are processed securely through certified PCI-DSS compliant payment gateways.</p>
          </div>

          <div className="document-section">
            <h2><Smartphone className="text-primary" /> 4. Vehicle Telematics & GPS Tracking</h2>
            <p>For fleet safety, security, and emergency recovery, our vehicles may be equipped with GPS tracking devices. GPS data is monitored strictly for location safety, geofencing breaches, and roadside assistance dispatch.</p>
          </div>

          <div className="document-section">
            <h2><UserCheck className="text-primary" /> 5. Your Data Rights</h2>
            <p>You have the right to request access to the personal information we hold about you, request corrections, or request deletion of your profile data by emailing privacy@vahan.rentals.</p>
          </div>
        </div>
      </div>

      <Callback />
    </motion.div>
  );
};

export default PrivacyPolicy;
