import React from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import HowItWorks from '../components/HowItWorks';
import Callback from '../components/Callback';
import { bikeData, carData, experienceData } from '../data';

const Home = () => {
  return (
    <>
      <Hero />
      <Section 
        badge="OUR PREMIUM FLEET"
        title={<>Bikes & <span>Scooties</span></>} 
        subtitle="The best two-wheelers for your mountain getaway in Uttarakhand." 
        items={bikeData} 
        viewAllLink="/bikes"
      />
      <Section 
        badge="COMFORTABLE TRAVEL"
        title={<>Popular Car/Taxi Service Fleet in <span>Rishikesh</span></>} 
        subtitle="Premium and standard cars for your comfortable travel." 
        items={carData} 
        viewAllLink="/cars"
      />
      <Section 
        badge="TOP RATED"
        title={<>Popular Experiences in <span>Rishikesh</span></>} 
        subtitle="Make your trip more memorable." 
        items={experienceData} 
        viewAllLink="/experiences"
      />
      <HowItWorks />
      <Callback />
    </>
  );
};

export default Home;
