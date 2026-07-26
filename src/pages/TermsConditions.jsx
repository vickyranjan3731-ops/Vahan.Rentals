import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, AlertTriangle, Scale, Clock, CheckCircle } from 'lucide-react';
import Callback from '../components/Callback';
import './StaticPage.css';

const TermsConditions = () => {
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
          <span className="static-hero-badge">Legal Guidelines</span>
          <h1>Terms & Conditions</h1>
          <p>Please read these terms carefully before booking any vehicle or tour experience with Vahan Rentals.</p>
        </div>
      </div>

      <div className="static-content-container">
        <div className="document-card">
          <div className="document-section">
            <h2><FileText className="text-primary" /> 1. Eligibility & Driving License Requirements</h2>
            <p>To rent any vehicle (bike, scooty, or self-drive car) from Vahan Rentals, the hirer must meet the following criteria:</p>
            <ul>
              <li>Must be at least 18 years of age for gearless scooties and 21 years of age for cars and high-capacity motorcycles.</li>
              <li>Must possess a valid original Driving License (DL) for the relevant category. Learners licenses are strictly not accepted.</li>
              <li>International tourists must provide a valid passport along with an International Driving Permit (IDP).</li>
            </ul>
          </div>

          <div className="document-section">
            <h2><Scale className="text-primary" /> 2. Vehicle Handover & Inspection</h2>
            <p>Before leaving the pickup station, the customer is requested to thoroughly inspect the vehicle for any existing scratches, damages, or mechanical issues.</p>
            <ul>
              <li>Photos or video recording of the vehicle during handover is highly recommended.</li>
              <li>Any pre-existing damage reported before leaving the premises will be documented in the digital agreement.</li>
            </ul>
          </div>

          <div className="document-section">
            <h2><AlertTriangle className="text-primary" /> 3. Speed Limits & Traffic Laws</h2>
            <p>Riders and drivers must strictly observe all local traffic regulations, traffic signals, and speed limits across Uttarakhand:</p>
            <ul>
              <li>Hill Region Speed Limit: Maximum 40 km/h on mountain twists and ghats.</li>
              <li>Helmet Policy: Wearing an ISI-certified helmet is compulsory for both rider and pillion passenger on two-wheelers.</li>
              <li>Off-Roading & Racing: Using vehicles for stunt riding, illegal racing, or unauthorized extreme off-roading is prohibited.</li>
            </ul>
          </div>

          <div className="document-section">
            <h2><Clock className="text-primary" /> 4. Security Deposit & Returns</h2>
            <p>A refundable security deposit is collected at vehicle handover via UPI, card, or cash.</p>
            <ul>
              <li>The deposit is refunded instantly upon returning the vehicle in clean, undamaged condition with valid fuel levels.</li>
              <li>Late returns exceeding 1 hour beyond agreed drop-off time will attract a pro-rata hourly late fee.</li>
            </ul>
          </div>

          <div className="document-section">
            <h2><CheckCircle className="text-primary" /> 5. Liability & Insurance</h2>
            <p>All vehicles carry valid third-party liability insurance. In case of accident or damage caused due to negligence or traffic violations, the hirer is liable for repair costs not covered by insurance policies.</p>
          </div>
        </div>
      </div>

      <Callback />
    </motion.div>
  );
};

export default TermsConditions;
