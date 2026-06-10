import React from 'react';
import { Link } from 'react-router-dom';

const OfferBanner = () => {
  return (
    <section className="offer-banner-section">
      <div className="container">
        <div className="offer-banner-content">
          <div className="offer-info">
            <span className="offer-tag">OFERTA DE TEMPORADA</span>
            <h2 className="offer-title">SUMMIT <br /> SEASON <span>SALE</span></h2>
            <p className="offer-desc">
              Domina las montañas con el mejor equipamiento. 
              Consigue hasta un <strong>40% OFF</strong> en cuadros de carbono 
              y suspensiones seleccionadas.
            </p>
            <Link to="/categoria/ofertas" className="btn-primary-large">
              Aprovechar Oferta ➔
            </Link>
          </div>
          <div className="offer-graphic">
            <div className="offer-circle-glow"></div>
            <img 
              src="https://images.unsplash.com/photo-1532298229144-0ee055737c9b?q=80&w=2070&auto=format&fit=crop" 
              alt="Extreme MTB Gear" 
              className="offer-image"
            />
            <div className="offer-badge-float">
              -40% <span>OFF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
