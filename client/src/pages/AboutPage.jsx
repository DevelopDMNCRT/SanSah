import React from 'react';

const AboutPage = () => {
  return (
    <div className="page-transition" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="hero-tag" style={{ background: 'var(--brand-primary)', padding: '0.5rem 1rem', borderRadius: '30px', color: 'white', fontWeight: 'bold' }}>
            Nuestra Historia
          </span>
          <h1 style={{ fontSize: '3.5rem', marginTop: '1.5rem', lineHeight: 1.1 }}>
            Pasión por el <br /> Ciclismo de Montaña
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '1.5rem', lineHeight: 1.6 }}>
            En SanSah Bikes, no solo vendemos equipamiento; compartimos la emoción de conquistar nuevos senderos y superar tus propios límites.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div>
            <img 
              src="/mtb_bike_premium.png" 
              alt="Sobre Nosotros" 
              style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
            />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Nuestra Misión</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Desde nuestra fundación, nos hemos dedicado a seleccionar exclusivamente los mejores componentes y bicicletas para ciclistas que buscan calidad sin compromisos. 
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              Creemos en la durabilidad, el rendimiento y, sobre todo, en la seguridad de nuestra comunidad. Cada producto en nuestra tienda ha sido probado para garantizar que soporte las condiciones más exigentes.
            </p>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '4rem', borderRadius: '32px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '2rem' }}>¿Por qué SanSah?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--brand-primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>+14 Años</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>De experiencia en el mercado de MTB.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--brand-primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Premium</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Solo las marcas más prestigiosas.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--brand-primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Expertos</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Asesoría personalizada por ciclistas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
