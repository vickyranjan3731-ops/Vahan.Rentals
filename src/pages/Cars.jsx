import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Callback from '../components/Callback';
import CarsHero from '../components/CarsHero';
import CarListingSection from '../components/CarListingSection';
import ScenicFeature from '../components/ScenicFeature';
import FleetStandards from '../components/FleetStandards';
import CabAdvantages from '../components/CabAdvantages';
import AppFeature from '../components/AppFeature';

const Cars = () => {
  return (
    <>
      <div className="cars-page">
        <CarsHero />
        <CarListingSection />
        <ScenicFeature />
        <FleetStandards />
        <CabAdvantages />
        <AppFeature />
      </div>
      <Callback />
    </>
  );
};

export default Cars;
