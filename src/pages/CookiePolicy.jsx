import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Sliders, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import Callback from '../components/Callback';
import './StaticPage.css';

const CookiePolicy = () => {
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
          <span className="static-hero-badge">Cookie & Tracking Notice</span>
          <h1>Cookie Policy</h1>
          <p>Learn how vahan.rentals uses cookies and tracking technologies to enhance your rental booking experience.</p>
        </div>
      </div>

      <div className="static-content-container">
        <div className="document-card">
          <div className="document-section">
            <h2><Cookie className="text-primary" /> 1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit <strong>vahan.rentals</strong>. 
              They enable our platform to remember your preferences, vehicle searches, active bookings, and login sessions so you don't have to re-enter details on every visit.
            </p>
          </div>

          <div className="document-section">
            <h2><Sliders className="text-primary" /> 2. Categories of Cookies We Use</h2>
            <p>We classify the cookies and browser storage used on our site into the following categories:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Critical for site operation, authenticating user sessions, and completing vehicle rental checkouts.</li>
              <li><strong>Preference Cookies:</strong> Store chosen pickup locations (e.g. Rishikesh, Dehradun), vehicle category filters, and rental dates.</li>
              <li><strong>Performance & Analytics:</strong> Track anonymous user movement to measure page load speeds, error occurrences, and improve site navigation.</li>
              <li><strong>Third-Party Service Cookies:</strong> Utilized by verified partners like Google Maps (location auto-suggest) and Razorpay (secure payment processing).</li>
            </ul>
          </div>

          <div className="document-section">
            <h2><ShieldCheck className="text-primary" /> 3. Managing Your Cookie Preferences</h2>
            <p>
              Most web browsers automatically accept cookies, but you can modify your browser settings to decline or clear cookies at any time. 
              Please note that disabling essential cookies may impact certain functionality, such as maintaining your active vehicle reservation cart or staying logged into your account.
            </p>
          </div>

          <div className="document-section">
            <h2><CheckCircle2 className="text-primary" /> 4. Third-Party Integrations</h2>
            <p>
              We integrate trusted third-party tools to deliver a high-quality experience. These services may place their own cookies to enable features like interactive location maps, payment gateways, and instant customer desk support.
            </p>
          </div>

          <div className="document-section">
            <h2><FileText className="text-primary" /> 5. Policy Updates & Contact Us</h2>
            <p>
              We may update our Cookie Policy periodically to reflect changes in web standards or regulatory requirements. 
              If you have any questions regarding how we use cookies, please email our privacy team at <a href="mailto:privacy@vahan.rentals" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>privacy@vahan.rentals</a>.
            </p>
          </div>
        </div>
      </div>

      <Callback />
    </motion.div>
  );
};

export default CookiePolicy;
