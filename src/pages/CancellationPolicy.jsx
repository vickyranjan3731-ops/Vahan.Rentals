import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import Callback from '../components/Callback';
import './StaticPage.css';

const tiers = [
  { time: "> 24 Hours Before Pickup", refund: "100% Full Refund", desc: "Cancel anytime up to 24 hours prior to scheduled pickup time with zero deduction.", color: "#2e7d32" },
  { time: "12 - 24 Hours Before Pickup", refund: "80% Refund", desc: "20% administrative deduction to cover inventory hold fees.", color: "#f57c00" },
  { time: "< 12 Hours Before Pickup", refund: "50% Refund", desc: "50% refund on total booking amount for last-minute cancellations.", color: "#e65100" },
  { time: "No Show / After Pickup Time", refund: "0% Refund", desc: "No refund applicable if vehicle is not picked up without prior notice.", color: "#c62828" }
];

const CancellationPolicy = () => {
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
          <span className="static-hero-badge">Transparent Policies</span>
          <h1>Cancellation & Refund Policy</h1>
          <p>We understand plans change in the mountains. Enjoy flexible cancellation options with instant refund processing.</p>
        </div>
      </div>

      <div className="static-content-container">
        {/* Policy Tiers */}
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', marginBottom: '1rem' }}>Refund Calculation Chart</h2>
        <motion.div 
          className="policy-tiers"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {tiers.map((t, i) => (
            <div className="tier-card" key={i} style={{ borderLeftColor: t.color }}>
              <div className="tier-time">{t.time}</div>
              <div className="tier-refund" style={{ color: t.color }}>{t.refund}</div>
              <p style={{ fontSize: '0.88rem', color: '#666', lineHeight: '1.5' }}>{t.desc}</p>
            </div>
          ))}
        </motion.div>

        <div className="document-card" style={{ marginTop: '2.5rem' }}>
          <div className="document-section">
            <h2><RefreshCw className="text-primary" /> How to Request a Cancellation</h2>
            <p>You can cancel your booking easily through any of the following channels:</p>
            <ul>
              <li><strong>WhatsApp / Phone:</strong> Message or call our support desk at +91 70605 12661 with your Booking ID.</li>
              <li><strong>Online Desk:</strong> Click "Request a Callback" below and select "Cancellation & Refund" as your query.</li>
            </ul>
          </div>

          <div className="document-section">
            <h2><Clock className="text-primary" /> Refund Processing Timelines</h2>
            <p>Once approved, refunds are credited back directly to the original payment source (UPI, Debit Card, Credit Card, or Net Banking):</p>
            <ul>
              <li><strong>UPI Payments:</strong> Instant refund processed within 15 - 30 minutes.</li>
              <li><strong>Cards / Net Banking:</strong> Processed within 2 to 5 business days as per bank settlement cycles.</li>
            </ul>
          </div>

          <div className="document-section">
            <h2><AlertCircle className="text-primary" /> Special Weather & Highway Closure Exceptions</h2>
            <p>If your trip is disrupted due to extreme weather, landslides, or official highway closures in Uttarakhand (e.g. Char Dham route blocked), Vahan Rentals will offer either <strong>100% full refund</strong> or <strong>free date rescheduling credit</strong> valid for 6 months.</p>
          </div>
        </div>
      </div>

      <Callback />
    </motion.div>
  );
};

export default CancellationPolicy;
