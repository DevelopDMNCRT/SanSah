import React from 'react';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import CategoryGrid from '../components/CategoryGrid';
import OfferBanner from '../components/OfferBanner';

const Home = () => {
  return (
    <div className="page-transition">
      <HeroSection />
      <ProductGrid />
      <CategoryGrid />
      <OfferBanner />
    </div>
  );
};

export default Home;
