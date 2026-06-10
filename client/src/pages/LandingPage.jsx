import React from 'react';

const LandingPage = () => {
  return (
    <main className="hero-landing-page">
      <div className="landing-overlay"></div>
      <div className="landing-content">
        <div className="landing-badge">Nuevo Lanzamiento</div>
        <h1>SanSah Bikes</h1>
        <p>Equipamiento premium para llevar tu pasión al límite. Conquista cada sendero sin mirar atrás.</p>
        
        <div className="landing-cta-container">
          <a href="/" className="landing-btn-primary">Entrar a la Tienda</a>
          <a href="/nosotros" className="landing-btn-secondary">Saber Más</a>
        </div>
      </div>
      
      <style>{`
        /* Reset para forzar 100vh sin scroll y sin márgenes */
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        .hero-landing-page {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('/hero_banner_bike.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          color: #ffffff;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          z-index: 9999; /* Por si el Nav/Footer no se ocultan, esto los tapará */
        }

        .landing-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.9) 0%,
            rgba(0, 0, 0, 0.6) 100%
          );
          z-index: 1;
        }

        .landing-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 800px;
          padding: 0 2rem;
          animation: fadeInLanding 1s ease-out forwards;
        }

        .landing-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(232, 129, 30, 0.2);
          border: 1px solid rgba(232, 129, 30, 0.5);
          color: #e8811e;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 2rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }

        .hero-landing-page h1 {
          font-size: clamp(3rem, 8vw, 5.5rem);
          font-weight: 900;
          margin: 0 0 1.5rem 0;
          line-height: 1.1;
          letter-spacing: -2px;
          background: linear-gradient(to right, #ffffff, #d1d5db);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .hero-landing-page p {
          font-size: clamp(1.1rem, 3vw, 1.5rem);
          font-weight: 300;
          line-height: 1.6;
          margin: 0 0 3rem 0;
          color: #cbd5e1;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .landing-cta-container {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .landing-btn-primary {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff !important;
          background: #e8811e;
          border: none;
          border-radius: 50px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(232, 129, 30, 0.3);
        }

        .landing-btn-primary:hover {
          transform: translateY(-3px);
          background: #f9902c;
          box-shadow: 0 15px 30px rgba(232, 129, 30, 0.4);
        }

        .landing-btn-secondary {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff !important;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          text-decoration: none;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .landing-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
        }

        @keyframes fadeInLanding {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
};

export default LandingPage;
