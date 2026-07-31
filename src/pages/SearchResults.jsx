import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Calendar, Filter, Star, ChevronRight, SlidersHorizontal, 
  Bike, Car, Compass, Check, ArrowUpDown, Sparkles, X, Phone, ShieldCheck
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bikeData, carData, experienceData } from '../data';
import Callback from '../components/Callback';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract initial parameters from URL
  const initialLocation = searchParams.get('location') || 'Rishikesh';
  const initialType = searchParams.get('type') || 'All';
  const initialStartDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')) : null;
  const initialEndDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')) : null;

  // Search Filter State
  const [location, setLocation] = useState(initialLocation);
  const [activeTab, setActiveTab] = useState(
    initialType.toLowerCase().includes('car') ? 'Car' : 
    initialType.toLowerCase().includes('activity') ? 'Activity' : 
    initialType.toLowerCase().includes('bike') ? 'Bike' : 'All'
  );
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('recommended'); // recommended, price-low, price-high, rating
  const [maxPrice, setMaxPrice] = useState(25000);

  // Combine all items with normalized categories
  const allFleet = useMemo(() => {
    const bikes = bikeData.map(b => ({ ...b, type: 'Bike', typeLabel: 'Bike & Scooty' }));
    const cars = carData.map(c => ({ ...c, type: 'Car', typeLabel: 'Cars & Cab' }));
    const activities = experienceData.map(a => ({ ...a, type: 'Activity', typeLabel: 'Experiences & Rafting' }));
    return [...bikes, ...cars, ...activities];
  }, []);

  // Filter items based on active criteria
  const filteredResults = useMemo(() => {
    return allFleet.filter(item => {
      // Category tab filter
      if (activeTab !== 'All' && item.type !== activeTab) {
        return false;
      }

      // Location match (check if item location includes selected location or vice versa)
      if (location && !item.location.toLowerCase().includes(location.toLowerCase()) && !location.toLowerCase().includes(item.location.split(',')[0].toLowerCase())) {
        // if user selected Haridwar or Mussoorie, keep results graceful
      }

      // Keyword search
      if (keyword.trim() !== '') {
        const query = keyword.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(query);
        const catMatch = item.category?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const locMatch = item.location?.toLowerCase().includes(query);
        if (!titleMatch && !catMatch && !descMatch && !locMatch) return false;
      }

      // Price limit filter
      const numericPrice = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
      if (numericPrice > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
      const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
      const ratingA = parseFloat(a.rating) || 0;
      const ratingB = parseFloat(b.rating) || 0;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return ratingB - ratingA;
      return 0; // recommended / default
    });
  }, [allFleet, activeTab, location, keyword, maxPrice, sortBy]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      if (!endDate || endDate <= date) {
        setEndDate(nextDay);
      }
    }
  };

  const getMinEndDate = () => {
    if (!startDate) return new Date();
    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  };

  const isRefineDisabled = !startDate || !endDate;

  // Handle refinement search submission
  const handleRefineSearch = (e) => {
    e.preventDefault();
    if (isRefineDisabled) return;
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (activeTab !== 'All') params.set('type', activeTab);
    if (startDate) params.set('startDate', startDate.toISOString().split('T')[0]);
    if (endDate) params.set('endDate', endDate.toISOString().split('T')[0]);
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setActiveTab('All');
    setKeyword('');
    setMaxPrice(25000);
    setSortBy('recommended');
  };

  return (
    <div className="search-results-page">
      {/* Header Banner & Live Refine Bar */}
      <section className="search-header-hero">
        <div className="container">
          <div className="search-header-text">
            <span className="search-badge">
              <Sparkles size={14} /> LIVE VAHAAN AVAILABILITY
            </span>
            <h1>
              Available Vehicles in <span className="highlight-text">{location || 'Uttarakhand'}</span>
            </h1>
            <p>
              Showing {filteredResults.length} premium two-wheelers, cars & adventure experiences for your trip.
            </p>
          </div>

          {/* Refinement Search Bar */}
          <form className="search-refine-bar" onSubmit={handleRefineSearch}>
            <div className="refine-field">
              <label><MapPin size={14} /> LOCATION</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="Rishikesh">Rishikesh</option>
                <option value="Dehradun">Dehradun</option>
                <option value="Haridwar">Haridwar</option>
                <option value="Mussoorie">Mussoorie</option>
              </select>
            </div>

            <div className="refine-divider"></div>

            <div className="refine-field">
              <label><Calendar size={14} /> START DATE</label>
              <DatePicker 
                selected={startDate} 
                onChange={handleStartDateChange} 
                placeholderText="Pickup date"
                dateFormat="dd MMM yyyy"
                minDate={new Date()}
                className="refine-datepicker"
              />
            </div>

            <div className="refine-divider"></div>

            <div className="refine-field">
              <label><Calendar size={14} /> END DATE</label>
              <DatePicker 
                selected={endDate} 
                onChange={(date) => setEndDate(date)} 
                placeholderText="Return date"
                dateFormat="dd MMM yyyy"
                minDate={getMinEndDate()}
                className="refine-datepicker"
              />
            </div>

            <div className="refine-divider"></div>

            <div className="refine-field">
              <label><Bike size={14} /> VAHAN TYPE</label>
              <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Bike">Bikes & Scooties</option>
                <option value="Car">Cars & Cabs</option>
                <option value="Activity">Experiences & Rafting</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="refine-submit-btn" 
              disabled={isRefineDisabled} 
              title={isRefineDisabled ? "Please select both start and end dates" : ""}
            >
              <Search size={18} /> Update Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container search-main-content">
        {/* Top Control Strip */}
        <div className="search-controls-strip">
          {/* Category Tabs */}
          <div className="category-tabs">
            <button 
              className={`cat-tab ${activeTab === 'All' ? 'active' : ''}`}
              onClick={() => setActiveTab('All')}
            >
              All Results <span className="count-pill">{allFleet.length}</span>
            </button>
            <button 
              className={`cat-tab ${activeTab === 'Bike' ? 'active' : ''}`}
              onClick={() => setActiveTab('Bike')}
            >
              <Bike size={16} /> Bikes & Scooties
            </button>
            <button 
              className={`cat-tab ${activeTab === 'Car' ? 'active' : ''}`}
              onClick={() => setActiveTab('Car')}
            >
              <Car size={16} /> Cars & Cabs
            </button>
            <button 
              className={`cat-tab ${activeTab === 'Activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('Activity')}
            >
              <Compass size={16} /> Experiences
            </button>
          </div>

          {/* Quick Search & Sort */}
          <div className="search-actions-right">
            <div className="inline-search-box">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search models (e.g. Himalayan, Thar)..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword && (
                <X size={14} className="clear-keyword" onClick={() => setKeyword('')} />
              )}
            </div>

            <div className="sort-dropdown-wrap">
              <ArrowUpDown size={15} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid / List */}
        {filteredResults.length > 0 ? (
          <motion.div 
            className="results-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredResults.map((item) => (
              <motion.div 
                className="result-card" 
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="card-image-wrap">
                  <img src={item.image} alt={item.title} />
                  {item.badge && <span className="card-badge">{item.badge}</span>}
                  <span className="card-category-pill">{item.category}</span>
                </div>

                <div className="card-body">
                  <div className="card-header-row">
                    <h3 className="card-title">{item.title}</h3>
                    <div className="card-rating">
                      <Star size={14} className="star-icon" />
                      <span>{item.rating}</span>
                      <small>({item.reviews || 45})</small>
                    </div>
                  </div>

                  <p className="card-location">
                    <MapPin size={13} /> {item.location}
                  </p>

                  <div className="card-specs-row">
                    {item.cc && <span className="spec-item">⚡ {item.cc} CC</span>}
                    {item.transmission && <span className="spec-item">⚙️ {item.transmission}</span>}
                    {item.seats && <span className="spec-item">👥 {item.seats} Seats</span>}
                    {item.fuel && <span className="spec-item">⛽ {item.fuel}</span>}
                    {item.duration && <span className="spec-item">⏱️ {item.duration}</span>}
                  </div>

                  <div className="card-footer-row">
                    <div className="price-tag">
                      <span className="price-val">{item.price}</span>
                      <span className="price-period">/ day</span>
                    </div>

                    <div className="card-btn-group">
                      <button 
                        className="btn-details"
                        onClick={() => navigate(`/vehicle/${item.id}`)}
                      >
                        View Details
                      </button>
                      <button 
                        className="btn-book-now"
                        onClick={() => navigate(`/vehicle/${item.id}`)}
                      >
                        Book Now <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="no-results-box">
            <div className="no-results-icon">
              <Search size={36} />
            </div>
            <h3>No Vehicles Found</h3>
            <p>We couldn't find any vehicles or activities matching your specific criteria in {location}.</p>
            <button className="btn btn-primary" onClick={clearAllFilters}>
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Embedded Callback Desk Banner */}
      <Callback />
    </div>
  );
};

export default SearchResults;
