import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Bikes from './pages/Bikes';
import Cars from './pages/Cars';
import VehicleDetails from './pages/VehicleDetails';
import SearchResults from './pages/SearchResults';

import HelpCenter from './pages/HelpCenter';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CancellationPolicy from './pages/CancellationPolicy';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import ContactUs from './pages/ContactUs';

import Admin from './pages/admin/Admin';
import AdminLogin from './pages/admin/AdminLogin';

import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const isAuthenticated = localStorage.getItem('vahan_admin_auth') === 'true';

  return (
    <div className="app">
      {!isAdminRoute && <Header />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bikes" element={<Bikes />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />

        {/* Support Routes */}
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />

        {/* Company Routes */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={isAuthenticated ? <Admin /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/admin" 
          element={<Navigate to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} replace />} 
        />
      </Routes>
      
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
