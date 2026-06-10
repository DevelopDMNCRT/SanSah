import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import extremeJumpImg from '../assets/hero_extreme_jump.png';

const HeroSection = () => {
  const heroImages = [
    extremeJumpImg,
    'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551711202-0c918ec3fdf7?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605235456141-7c4ddc8a681d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571173200318-77a83707ed54?q=80&w=2072&auto=format&fit=crop'
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section 
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: '#0a0a0a', 
        overflow: 'hidden',
        paddingTop: '80px'
      }}
    >
      {/* Background Images Carousel */}
      {heroImages.map((imgUrl, index) => (
        <div 
          key={imgUrl + index}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${imgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: index === currentIndex ? 0.7 : 0, // Lower opacity for better text legibility
            transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 8s linear',
            transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)',
            zIndex: 0
          }}
        />
      ))}

      {/* Refined overlay for contrast and light */}
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0) 100%)',
          zIndex: 2 
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(232, 129, 30, 0.05) 0%, transparent 50%)',
          zIndex: 1
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div className="hero-content" style={{ maxWidth: '650px' }}>
          <span className="hero-tag" style={{ background: 'var(--brand-primary)', padding: '0.5rem 1rem', borderRadius: '30px', display: 'inline-block', color: 'white', fontWeight: 'bold' }}>
            NUEVA COLECCIÓN 2026
          </span>
          <h1 className="hero-title" style={{ fontSize: '4.5rem', lineHeight: 1.1, marginTop: '1rem', textShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            Domina <br /> Todos Los Terrenos
          </h1>
          <p className="hero-desc" style={{ fontSize: '1.3rem', maxWidth: '500px', color: 'var(--text-accent)' }}>
            Equipamiento premium, bicicletas de montaña y los mejores 
            componentes diseñados para llevar tu rendimiento al límite.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/categoria/bicicletas" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', padding: '1rem 2rem' }}>
              Explorar Bicicletas
            </Link>
            <Link to="/categoria/ofertas" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block', padding: '1rem 2rem', background: 'rgba(255,255,255,0.5)' }}>
              Ver Ofertas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
