import React from 'react';
import BikesHero from '../components/BikesHero';
import BikeListingSection from '../components/BikeListingSection';
import BikeScenicFeature from '../components/BikeScenicFeature';
import BikeStandards from '../components/BikeStandards';
import BikeAdvantages from '../components/BikeAdvantages';
import AppFeature from '../components/AppFeature';
import Callback from '../components/Callback';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Bikes = () => {
  return (
    <>
      <div className="bikes-page">
        {/* We assume Header is already rendered in App.jsx via Router, but if not we can add it here. */}
        
        <BikesHero />
        <BikeListingSection />
        
        <BikeScenicFeature />
        <BikeStandards />
        <BikeAdvantages />
        
        {/* We can reuse the AppFeature section from the Cars page as it highlights routes/maps perfectly */}
        <AppFeature />
        
        <Callback />
      </div>
    </>
  );
};

export default Bikes;
