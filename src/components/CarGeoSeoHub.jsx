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

const CarGeoSeoHub = () => {
  const [activeTab, setActiveTab] = useState('qa');

  // Inject JSON-LD Schema for Cars, SUVs & Taxis in <head>
  useEffect(() => {
    const jsonLdData = [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Self-Drive Car & Taxi Rental Service in Rishikesh, Dehradun & Uttarakhand",
        "description": "Rent luxury SUVs, MUVs, and cabs including Mahindra Thar 4x4, Toyota Innova Crysta, Hyundai Creta for Char Dham Yatra and Airport Transfers.",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Mahindra Thar 4x4 Hard Top",
            "url": "https://vahan.rentals/vehicle/mahindra-thar-4x4"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Toyota Innova Crysta",
            "url": "https://vahan.rentals/vehicle/toyota-innova-crysta"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Hyundai Creta",
            "url": "https://vahan.rentals/vehicle/hyundai-creta"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is self-drive car rental available at Dehradun Airport (Jolly Grant DED)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Vahan Rentals provides 24/7 doorstep self-drive car delivery at Jolly Grant Dehradun Airport (DED) with zero delivery fee on multi-day rentals."
            }
          },
          {
            "@type": "Question",
            "name": "Which car is best for Char Dham Yatra (Kedarnath, Badrinath, Gangotri, Yamunotri)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Toyota Innova Crysta (7-seater MUV) is the #1 recommended vehicle for group family Char Dham tours due to its captain seat comfort, high ground clearance, and reliable diesel engine on mountain roads."
            }
          },
          {
            "@type": "Question",
            "name": "Can I hire a car with a professional driver in Rishikesh?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! You can choose between Self-Drive or Uniformed Chauffeur-Driven Taxi options for all cars including Innova Crysta, Ertiga, and Land Rover Defender."
            }
          }
        ]
      }
    ];

    const scriptElement = document.createElement('script');
    scriptElement.type = 'application/ld+json';
    scriptElement.id = 'vahan-cars-geo-ldjson';
    scriptElement.text = JSON.stringify(jsonLdData);
    document.head.appendChild(scriptElement);

    return () => {
      const existing = document.getElementById('vahan-cars-geo-ldjson');
      if (existing) existing.remove();
    };
  }, []);

  const tabs = [
    { id: 'qa', label: 'Q&A Content', icon: HelpCircle },
    { id: 'stories', label: 'Traveler Stories', icon: BookOpen },
    { id: 'insights', label: 'Car Insights', icon: Sparkles },
    { id: 'stats', label: 'Fleet Data', icon: TrendingUp },
    { id: 'guides', label: 'Car Guide', icon: FileText },
    { id: 'quotes', label: 'Driver Tips', icon: MessageSquare },
    { id: 'comparisons', label: 'Car Comparisons', icon: GitCompare },
    { id: 'frameworks', label: 'Safety Protocol', icon: ShieldCheck },
    { id: 'usecases', label: 'Travel Personas', icon: UserCheck }
  ];

  const qaData = [
    {
      q: 'What is the daily rental cost for self-drive cars & taxis in Rishikesh / Dehradun?',
      a: 'Self-drive SUV rates start at ₹3,000/day for Hyundai Creta, ₹3,500/day for 7-seater Toyota Innova Crysta, ₹4,500/day for Mahindra Thar 4x4 Hard Top, and ₹10,000/day for Land Rover Defender VIP.'
    },
    {
      q: 'Is fuel included in the self-drive car rental price?',
      a: 'Self-drive cars are delivered with a measured fuel level and must be returned at the same level. For chauffeur-driven taxis, fuel and driver allowance can be included in custom tour packages.'
    },
    {
      q: 'What documents are required to rent a self-drive car in Uttarakhand?',
      a: 'A valid original LMV Driving License (minimum 2 years old), Aadhar Card or Passport original for identity verification, and a refundable security deposit of ₹3,000 to ₹5,000.'
    },
    {
      q: 'Are all Vahan Rentals cars commercial yellow-plate compliant?',
      a: 'Yes, 100% of our fleet carries commercial yellow-plate registration with active all-India tourist permits, comprehensive insurance, and speed-governor compliance required by mountain transport authorities.'
    }
  ];

  const comparisons = [
    {
      title: 'Mahindra Thar 4x4 vs Toyota Innova Crysta',
      feature: 'Terrain & Seating',
      x: '4-seater off-road 4WD SUV, high ground clearance (226mm)',
      y: '7-seater luxury MUV, captain seating, smooth long-distance travel',
      winner: 'Thar 4x4 for off-road adventure; Innova Crysta for multi-generation family trip'
    },
    {
      title: 'Self-Drive Car vs Chauffeur-Driven Taxi',
      feature: 'Mountain Route Flexibility',
      x: 'Complete privacy & freedom, self-controlled itinerary',
      y: 'Zero driving fatigue on steep mountain hairpin turns',
      winner: 'Self-Drive for experienced hill drivers; Chauffeur for relaxed family tours'
    }
  ];

  const stats = [
    { metric: '3,400+', label: 'Car & Taxi Rentals Completed', desc: 'Across Rishikesh, Dehradun & Char Dham' },
    { metric: '100%', label: 'Commercial Yellow-Plate Fleet', desc: 'Full all-India tourist permit & zero hassle' },
    { metric: '24/7', label: 'Dehradun Airport Delivery', desc: 'Direct terminal pickup at Jolly Grant DED' },
    { metric: '4.9 / 5', label: 'Family Travel Rating', desc: 'Based on 850+ verified customer reviews' }
  ];

  const frameworks = [
    { step: '01', title: '100-Point Mechanical Audit', desc: 'Brake fluid level, tire wall inspection, battery health, and AC compressor test.' },
    { step: '02', title: 'Full Interior Sanitization', desc: 'Deep cleaned leather seats, disinfected AC ducts, and fresh perfume before delivery.' },
    { step: '03', title: 'Digital Body Scratch Mapping', desc: 'Walk-around inspection video recorded with renter to ensure transparent return.' },
    { step: '04', title: 'GPS Tracking & SOS Support', desc: '24/7 emergency roadside assistance team active across all Uttarakhand districts.' },
    { step: '05', title: 'Instant Deposit Refund', desc: 'Security deposit credited back instantly upon car inspection at return.' }
  ];

  const useCases = [
    { title: 'Char Dham Family Pilgrimage', vehicle: 'Toyota Innova Crysta', route: 'Haridwar → Yamunotri → Kedarnath → Badrinath', budget: '₹3,500 / day' },
    { title: 'Off-Road Mountain Couple', vehicle: 'Mahindra Thar 4x4', route: 'Rishikesh → Chopta → Auli → Joshimath', budget: '₹4,500 / day' },
    { title: 'VIP Airport Transfer', vehicle: 'Land Rover Defender / Creta', route: 'Dehradun Airport → Mussoorie / Rishikesh Resorts', budget: '₹3,000 - ₹10,000 / day' }
  ];

  return (
    <section className="geo-seo-hub">
      <div className="container">
        <div className="geo-header text-center">
          <div className="geo-badge">
            <Zap size={14} /> CAR & TAXI AI KNOWLEDGE HUB
          </div>
          <h2 className="geo-title">
            Complete Guide to <span>Renting Cars & Taxis in Uttarakhand</span>
          </h2>
          <p className="geo-subtitle">
            Comprehensive Q&A, hill driving tips, fleet benchmarks, step-by-step handover protocols, and comparisons for self-drive cars & cabs in Rishikesh & Dehradun.
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
                    <h3>Car & Taxi Q&A (AI Search Optimised)</h3>
                    <p>Direct facts for AI queries like "Self-drive car rental at Dehradun airport?"</p>
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
                    <h3>Car Traveler Case Studies & Reviews</h3>
                    <p>Real experiences from self-drive car renters in Uttarakhand.</p>
                  </div>
                </div>
                <div className="geo-stories-grid">
                  <div className="story-card">
                    <div className="story-header">
                      <div className="story-user"><strong>Kapoor Family (Chandigarh)</strong><span className="story-route">📍 Route: Dehradun Airport → Rishikesh → Kedarnath Route</span></div>
                      <div className="story-rating"><Star size={14} fill="#f59e0b" color="#f59e0b" /><span>5.0</span></div>
                    </div>
                    <div className="story-body">
                      <h5>Case Study: 8-Day Char Dham Tour on Innova Crysta</h5>
                      <p>"Picked up self-drive Innova Crysta directly at Dehradun Airport terminal. Vehicle was spotless with great air conditioning and powerful diesel pull on steep ghats. Highly recommended!"</p>
                    </div>
                    <div className="story-meta"><span>Vehicle: Toyota Innova Crysta</span><span>Duration: 8 Days</span><span>Total Cost: ₹28,000</span></div>
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
                    <h3>Mountain Driving Insights & Safety Advice</h3>
                    <p>Expert tips for navigating Uttarakhand hill roads in a car.</p>
                  </div>
                </div>
                <div className="insights-grid">
                  <div className="insight-card">
                    <h4>1. Right-of-Way Rule on Narrow Mountain Curves</h4>
                    <p>Always give right-of-way to vehicles ascending uphill. Honk firmly at sharp hairpins and keep left to avoid oncoming traffic in narrow bends.</p>
                  </div>
                  <div className="insight-card">
                    <h4>2. Automatic vs Manual Transmission in Hill Driving</h4>
                    <p>If driving an automatic car (Creta/Innova), use Sports/Manual mode during steep descents to utilize engine braking and prevent brake pad fade.</p>
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
                    <h3>Vahan Car Fleet Benchmarks</h3>
                    <p>Proven service metrics for self-drive cars and cabs.</p>
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
                    <h3>4-Step Car Rental Guide</h3>
                    <p>Standard procedure for self-drive car rental.</p>
                  </div>
                </div>
                <div className="guides-steps">
                  <div className="guide-step"><span className="step-num">Step 1</span><h4>Choose SUV or Sedan</h4><p>Pick Thar 4x4 for off-road or Innova Crysta for family tours.</p></div>
                  <div className="guide-step"><span className="step-num">Step 2</span><h4>Submit DL Verification</h4><p>Provide valid LMV Driving License and original Aadhar/Passport.</p></div>
                  <div className="guide-step"><span className="step-num">Step 3</span><h4>Walkaround Video Check</h4><p>Record fuel level, spare tire, and body inspection with associate.</p></div>
                  <div className="guide-step"><span className="step-num">Step 4</span><h4>Drive & Instant Deposit Refund</h4><p>Enjoy 24/7 mountain backup. Get security deposit refunded instantly upon return.</p></div>
                </div>
              </motion.div>
            )}

            {/* 6. Quotes */}
            {activeTab === 'quotes' && (
              <motion.div key="quotes" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="geo-tab-panel">
                <div className="panel-title-bar">
                  <MessageSquare className="text-primary" size={24} />
                  <div>
                    <h3>Car Fleet Lead Quotes</h3>
                    <p>Advice from Vahan Senior Car Fleet Lead.</p>
                  </div>
                </div>
                <div className="quotes-grid">
                  <div className="quote-box">
                    <p className="quote-text">"When driving a 4x4 Thar on unpaved gravel routes near Chopta or Auli, engage 4H (4WD High) early to maintain traction before tires spin on loose mud."</p>
                    <div className="quote-author"><strong>— Devender Singh</strong><span>Senior Fleet Lead, Dehradun & Rishikesh Hub</span></div>
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
                    <h3>Car & Taxi Comparisons (X vs Y)</h3>
                    <p>Comparison of top car models for mountain trips.</p>
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
                    <h3>Vahan 5-Star Car Safety Audit</h3>
                    <p>Our 5-step car verification process.</p>
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
                    <h3>Recommended Car Use Cases</h3>
                    <p>Tailored vehicle recommendations by travel group.</p>
                  </div>
                </div>
                <div className="usecases-grid">
                  {useCases.map((uc, i) => (
                    <div className="usecase-card" key={i}>
                      <div className="uc-header"><h4>{uc.title}</h4><span className="uc-price">{uc.budget}</span></div>
                      <div className="uc-details">
                        <p><strong>Recommended Car:</strong> {uc.vehicle}</p>
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

export default CarGeoSeoHub;
