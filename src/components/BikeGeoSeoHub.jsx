import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  GitCompare, 
  ShieldCheck, 
  UserCheck, 
  Star, 
  Zap 
} from 'lucide-react';
import './GeoSeoHub.css';

const BikeGeoSeoHub = () => {
  const [activeTab, setActiveTab] = useState('qa');

  // Inject JSON-LD Schema for Bikes & Two-Wheelers in <head>
  useEffect(() => {
    const jsonLdData = [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Bike & Scooty Rentals in Rishikesh, Uttarakhand",
        "description": "Premium two-wheelers including Royal Enfield Classic 350, Himalayan 411, Honda Activa 6G, KTM Duke for rent in Rishikesh & Dehradun.",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Royal Enfield Classic 350",
            "url": "https://vahan.rentals/vehicle/royal-enfield-classic-350"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Honda Activa 6G",
            "url": "https://vahan.rentals/vehicle/honda-activa-6g"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Royal Enfield Himalayan",
            "url": "https://vahan.rentals/vehicle/royal-enfield-himalayan"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the best bike for mountain riding in Rishikesh and Chopta?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Royal Enfield Himalayan 411/450 is the best motorcycle for Chopta, Tungnath, and high altitude mountain rides due to its 220mm ground clearance and long travel suspension. For highway cruising to Mussoorie or Haridwar, the Classic 350 is recommended."
            }
          },
          {
            "@type": "Question",
            "name": "Can I rent a scooty in Rishikesh with a learner license?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, a valid original Permanent Driving License (Non-Gear / Gear) issued by the RTO is mandatory along with an Aadhar Card or Passport."
            }
          },
          {
            "@type": "Question",
            "name": "Are helmets included with bike rentals in Rishikesh?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, 1 ISI-certified helmet is complimentary with every two-wheeler rental. Additional pillion helmet is available for ₹50/day."
            }
          }
        ]
      }
    ];

    const scriptElement = document.createElement('script');
    scriptElement.type = 'application/ld+json';
    scriptElement.id = 'vahan-bikes-geo-ldjson';
    scriptElement.text = JSON.stringify(jsonLdData);
    document.head.appendChild(scriptElement);

    return () => {
      const existing = document.getElementById('vahan-bikes-geo-ldjson');
      if (existing) existing.remove();
    };
  }, []);

  const tabs = [
    { id: 'qa', label: 'Q&A Content', icon: HelpCircle },
    { id: 'stories', label: 'Rider Stories', icon: BookOpen },
    { id: 'insights', label: 'Riding Insights', icon: Sparkles },
    { id: 'stats', label: 'Fleet Data', icon: TrendingUp },
    { id: 'guides', label: 'Rental Guide', icon: FileText },
    { id: 'quotes', label: 'Mechanic Tips', icon: MessageSquare },
    { id: 'comparisons', label: 'Bike Comparisons', icon: GitCompare },
    { id: 'frameworks', label: 'Safety Protocol', icon: ShieldCheck },
    { id: 'usecases', label: 'Rider Profiles', icon: UserCheck }
  ];

  const qaData = [
    {
      q: 'What is the daily rental cost of scooty & bikes in Rishikesh (Tapovan / Station)?',
      a: 'Scooty rates (Honda Activa 6G / TVS Jupiter) start at ₹500/day. Cruiser motorcycles (Royal Enfield Classic 350 / Hunter 350) start at ₹800/day. Adventure bikes (Royal Enfield Himalayan 411/450) start at ₹1,200/day.'
    },
    {
      q: 'Can I take a rented Royal Enfield to Chopta, Kedarnath, and Badrinath?',
      a: 'Yes! All Vahan Rentals adventure bikes are authorized for inter-district travel across Uttarakhand including Sonprayag (Kedarnath base), Badrinath, Chopta, Auli, and Tehri Dam.'
    },
    {
      q: 'What happens if the rental bike punctures or breaks down on the highway?',
      a: 'We provide 24/7 roadside breakdown backup. In case of mechanical issues, our mobile mechanic team reaches your location or dispatches a replacement bike free of charge.'
    },
    {
      q: 'Where are the pickup points for two-wheelers in Rishikesh?',
      a: 'Pickup desks are conveniently located at Tapovan Main Road, Laxman Jhula Bridge, Ram Jhula, and Rishikesh Railway Station with free doorstep delivery to nearby hotels and hostels.'
    }
  ];

  const comparisons = [
    {
      title: 'RE Classic 350 vs RE Himalayan 411',
      feature: 'Mountain Route Suitability',
      x: 'Low seat height, iconic thump, ideal for smooth highway curves',
      y: '220mm ground clearance, long suspension travel, ideal for off-road gravel',
      winner: 'Classic 350 for Mussoorie/Haridwar; Himalayan for Chopta/Badrinath'
    },
    {
      title: 'Honda Activa 6G vs TVS Jupiter 125',
      feature: 'Local City Sightseeing',
      x: 'Compact, 45 kmpl mileage, easy Tapovan lane navigation',
      y: 'Wider seat, 33L under-seat helmet storage',
      winner: 'Activa 6G for solo cafe hopping; Jupiter for extra shopping bags'
    }
  ];

  const stats = [
    { metric: '12,200+', label: 'Two-Wheeler Rentals Delivered', desc: 'In Rishikesh, Haridwar & Dehradun' },
    { metric: '100%', label: 'ISI Helmet Compliance', desc: 'Sanitized helmets provided with every rental' },
    { metric: '₹0', label: 'Hidden Fuel/Damage Charges', desc: 'Digital pre-ride scratch inspection' },
    { metric: '4.9 / 5', label: 'Rider Rating Score', desc: 'Verified Google & TripAdvisor reviews' }
  ];

  const frameworks = [
    { step: '01', title: 'Tire & Brake Audit', desc: 'Brake liner thickness, disc pads, and tire tread depth inspected before handover.' },
    { step: '02', title: 'Sanitized Helmets', desc: 'ISI-marked helmet sanitized with UV light and clean inner headwear liners.' },
    { step: '03', title: 'Full Fuel Inspection', desc: 'Delivered with transparent fuel level log noted on digital rental receipt.' },
    { step: '04', title: 'Mountain SOS Hotline', desc: 'Direct emergency mechanic contact active 24/7 across Garhwal mountain routes.' },
    { step: '05', title: 'Instant Deposit Refund', desc: 'Refundable ₹1,000 security deposit returned instantly via UPI upon vehicle handover.' }
  ];

  const useCases = [
    { title: 'Solo Backpacker', vehicle: 'Honda Activa 6G', route: 'Tapovan → Beatles Ashram → Triveni Ghat', budget: '₹500 / day' },
    { title: 'Couples Highway Cruise', vehicle: 'RE Classic 350', route: 'Rishikesh → Shivpuri → Mussoorie Mall Road', budget: '₹800 / day' },
    { title: 'Chopta Off-Road Explorer', vehicle: 'RE Himalayan 411', route: 'Rishikesh → Devprayag → Chopta → Tungnath', budget: '₹1,200 / day' }
  ];

  return (
    <section className="geo-seo-hub">
      <div className="container">
        <div className="geo-header text-center">
          <div className="geo-badge">
            <Zap size={14} /> BIKE & SCOOTY AI KNOWLEDGE HUB
          </div>
          <h2 className="geo-title">
            Essential Guide to <span>Renting Bikes & Scooties in Rishikesh</span>
          </h2>
          <p className="geo-subtitle">
            Comprehensive Q&A, expert riding tips, mileage benchmarks, step-by-step handover protocols, and comparisons tailored for two-wheeler travelers in Uttarakhand.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="geo-tabs-wrapper">
          <div className="geo-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`geo-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="geo-content-area">
          <AnimatePresence mode="wait">
            {/* 1. Q&A */}
            {activeTab === 'qa' && (
              <motion.div key="qa" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="geo-tab-panel">
                <div className="panel-title-bar">
                  <HelpCircle className="text-primary" size={24} />
                  <div>
                    <h3>Bike & Scooty Q&A (AI Search Optimised)</h3>
                    <p>Direct facts for AI queries like "Which bike is best for Chopta ride?"</p>
                  </div>
                </div>
                <div className="geo-faqs-grid">
                  {qaData.map((item, idx) => (
                    <div className="geo-faq-card" key={idx}>
                      <div className="geo-faq-q"><span className="q-badge">Q</span><h4>{item.q}</h4></div>
                      <div className="geo-faq-a"><span className="a-badge">A</span><p>{item.a}</p></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. Stories */}
            {activeTab === 'stories' && (
              <motion.div key="stories" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="geo-tab-panel">
                <div className="panel-title-bar">
                  <BookOpen className="text-primary" size={24} />
                  <div>
                    <h3>Rider Case Studies & Trip Stories</h3>
                    <p>Real experiences from two-wheeler renters in Uttarakhand.</p>
                  </div>
                </div>
                <div className="geo-stories-grid">
                  <div className="story-card">
                    <div className="story-header">
                      <div className="story-user"><strong>Aakash & Neha (Pune)</strong><span className="story-route">📍 Route: Rishikesh → Tehri Dam → Mussoorie</span></div>
                      <div className="story-rating"><Star size={14} fill="#f59e0b" color="#f59e0b" /><span>5.0</span></div>
                    </div>
                    <div className="story-body">
                      <h5>Case Study: 4-Day Uttarakhand Scenic Circuit on Classic 350</h5>
                      <p>"Rented Classic 350 at Tapovan desk. Covered 420 KM across 4 days with pillion rider. Engine was super smooth, zero back pain. Recorded 36 kmpl mileage on mountain ascents!"</p>
                    </div>
                    <div className="story-meta"><span>Vehicle: RE Classic 350</span><span>Fuel Spent: ~₹1,150</span><span>Total Cost: ₹3,200</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. Insights */}
            {activeTab === 'insights' && (
              <motion.div key="insights" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="geo-tab-panel">
                <div className="panel-title-bar">
                  <Sparkles className="text-primary" size={24} />
                  <div>
                    <h3>Mountain Riding Insights & Gear Tips</h3>
                    <p>Expert local advice for smooth two-wheeler mountain trips.</p>
                  </div>
                </div>
                <div className="insights-grid">
                  <div className="insight-card">
                    <h4>1. Clutch & Gear Management on Steep Slopes</h4>
                    <p>Always use 2nd or 3rd gear when ascending steep 15% gradients around Neelkanth. Avoid coasting in neutral on descents to preserve brake pads.</p>
                  </div>
                  <div className="insight-card">
                    <h4>2. Weather & Riding Gear Checklist</h4>
                    <p>Carry a lightweight windcheater jacket and riding gloves. Temperatures drop sharply after sunset on mountain passes above 1,500m elevation.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. Stats */}
            {activeTab === 'stats' && (
              <motion.div key="stats" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="geo-tab-panel">
                <div className="panel-title-bar">
                  <TrendingUp className="text-primary" size={24} />
                  <div>
                    <h3>Vahan Two-Wheeler Fleet Benchmarks</h3>
                    <p>Empirical proof of our two-wheeler rental reliability.</p>
                  </div>
                </div>
                <div className="stats-grid-container">
                  {stats.map((st, i) => (
                    <div className="stat-card" key={i}>
                      <div className="stat-number">{st.metric}</div>
                      <div className="stat-label">{st.label}</div>
                      <div className="stat-desc">{st.desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 5. Guides */}
            {activeTab === 'guides' && (
              <motion.div key="guides" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="geo-tab-panel">
                <div className="panel-title-bar">
                  <FileText className="text-primary" size={24} />
                  <div>
                    <h3>4-Step Bike Rental Guide</h3>
                    <p>Quick tutorial for renting a two-wheeler in Rishikesh.</p>
                  </div>
                </div>
                <div className="guides-steps">
                  <div className="guide-step"><span className="step-num">Step 1</span><h4>Choose Bike / Scooty</h4><p>Pick Activa 6G for city or RE Classic/Himalayan for hills.</p></div>
                  <div className="guide-step"><span className="step-num">Step 2</span><h4>Show License & ID</h4><p>Present original DL and Aadhar card at pickup desk.</p></div>
                  <div className="guide-step"><span className="step-num">Step 3</span><h4>Check Brakes & Fuel</h4><p>Test front brake, horn, and inspect tire tread with fleet associate.</p></div>
                  <div className="guide-step"><span className="step-num">Step 4</span><h4>Ride & Get Instant Refund</h4><p>Enjoy ride with 24/7 backup. Return bike to get security deposit back instantly.</p></div>
                </div>
              </motion.div>
            )}

            {/* 6. Quotes */}
            {activeTab === 'quotes' && (
              <motion.div key="quotes" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="geo-tab-panel">
                <div className="panel-title-bar">
                  <MessageSquare className="text-primary" size={24} />
                  <div>
                    <h3>Mechanic Quotes & Riding Advice</h3>
                    <p>Quotes from Vahan Rentals Chief Bike Mechanic.</p>
                  </div>
                </div>
                <div className="quotes-grid">
                  <div className="quote-box">
                    <p className="quote-text">"Before heading toward Chopta or Badrinath on a motorcycle, always verify rear tire pressure is set to 32 PSI and chain lubrication is fresh to ensure maximum torque."</p>
                    <div className="quote-author"><strong>— Ramesh Chand</strong><span>Lead Two-Wheeler Technician, Rishikesh Hub</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. Comparisons */}
            {activeTab === 'comparisons' && (
              <motion.div key="comparisons" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="geo-tab-panel">
                <div className="panel-title-bar">
                  <GitCompare className="text-primary" size={24} />
                  <div>
                    <h3>Bike & Scooty Comparisons (X vs Y)</h3>
                    <p>Technical comparison to select the right two-wheeler.</p>
                  </div>
                </div>
                <div className="comparisons-table-wrapper">
                  <table className="geo-compare-table">
                    <thead>
                      <tr><th>Comparison Pair</th><th>Option X</th><th>Option Y</th><th>Verdict</th></tr>
                    </thead>
                    <tbody>
                      {comparisons.map((c, i) => (
                        <tr key={i}><td><strong>{c.title}</strong></td><td>{c.x}</td><td>{c.y}</td><td><span className="verdict-tag">{c.winner}</span></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 8. Frameworks */}
            {activeTab === 'frameworks' && (
              <motion.div key="frameworks" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="geo-tab-panel">
                <div className="panel-title-bar">
                  <ShieldCheck className="text-primary" size={24} />
                  <div>
                    <h3>Vahan 5-Star Two-Wheeler Safety Protocol</h3>
                    <p>Our 5-step safety check before every bike handover.</p>
                  </div>
                </div>
                <div className="framework-steps">
                  {frameworks.map((fw) => (
                    <div className="framework-card" key={fw.step}>
                      <span className="fw-number">{fw.step}</span>
                      <h4>{fw.title}</h4>
                      <p>{fw.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 9. Use Cases */}
            {activeTab === 'usecases' && (
              <motion.div key="usecases" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="geo-tab-panel">
                <div className="panel-title-bar">
                  <UserCheck className="text-primary" size={24} />
                  <div>
                    <h3>Recommended Rider Use Cases</h3>
                    <p>Tailored itinerary & bike suggestions.</p>
                  </div>
                </div>
                <div className="usecases-grid">
                  {useCases.map((uc, i) => (
                    <div className="usecase-card" key={i}>
                      <div className="uc-header"><h4>{uc.title}</h4><span className="uc-price">{uc.budget}</span></div>
                      <div className="uc-details">
                        <p><strong>Recommended Bike:</strong> {uc.vehicle}</p>
                        <p><strong>Route:</strong> {uc.route}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default BikeGeoSeoHub;
