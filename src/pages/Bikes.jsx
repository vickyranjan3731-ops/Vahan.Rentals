import React from 'react';
import BikesHero from '../components/BikesHero';
import BikeListingSection from '../components/BikeListingSection';
import BikeScenicFeature from '../components/BikeScenicFeature';
import BikeStandards from '../components/BikeStandards';
import BikeAdvantages from '../components/BikeAdvantages';
import BikeGeoSeoHub from '../components/BikeGeoSeoHub';
import AppFeature from '../components/AppFeature';
import Callback from '../components/Callback';

const Bikes = () => {
  return (
    <>
      <div className="bikes-page">
        <BikesHero />
        <BikeListingSection />
        
        <BikeScenicFeature />
        <BikeStandards />
        <BikeAdvantages />
        
        <BikeGeoSeoHub />
        
        <AppFeature />
        
        <Callback />
      </div>
    </>
  );
};

export default Bikes;
