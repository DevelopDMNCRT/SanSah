import { useState } from 'react';

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '12px',
  border: '1px solid var(--glass-border)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: 'var(--text-accent)',
  marginBottom: '0.5rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const ContactPage = () => {
  const [form, setForm] = useState({ email: '', telefono: '', mensaje: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ email: '', telefono: '', mensaje: '' });
  };

  return (
    <div className="page-transition" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--text-accent)', marginBottom: '1rem' }}>Contáctanos</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem' }}>
          Estamos aquí para ayudarte a dominar todos los terrenos. Escríbenos o visítanos en nuestra tienda principal.
        </p>

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <h3 style={{ marginBottom: '0.5rem' }}>Email</h3>
            <p style={{ color: 'var(--text-secondary)' }}>hola@sansahbikes.com</p>
          </div>

          <div style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <h3 style={{ marginBottom: '0.5rem' }}>Teléfono</h3>
            <p style={{ color: 'var(--text-secondary)' }}>351 202 3760</p>
          </div>

          <div style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <h3 style={{ marginBottom: '0.5rem' }}>Ubicación</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Plaza Ana, Local J3,<br />Zamora, Mich.</p>
          </div>
        </div>
      </div>

      {/* Form + Map — wider container */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
        <div className="contact-layout">

          {/* Formulario */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--glass-border)', padding: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-accent)' }}>Envíanos un mensaje</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>Te respondemos a la brevedad posible.</p>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3 style={{ color: 'var(--text-accent)', marginBottom: '0.5rem' }}>¡Mensaje enviado!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Nos pondremos en contacto contigo pronto.</p>
                <button
                  onClick={() => setSent(false)}
                  style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', borderRadius: '12px', padding: '0.6rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Correo electrónico</label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange} required
                    placeholder="tu@correo.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input
                    type="tel" name="telefono" value={form.telefono} onChange={handleChange}
                    placeholder="351 000 0000" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Mensaje</label>
                  <textarea
                    name="mensaje" value={form.mensaje} onChange={handleChange} required
                    placeholder="¿En qué podemos ayudarte?" rows={5}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                  />
                </div>
                <button
                  type="submit" className="btn-primary"
                  style={{ alignSelf: 'flex-start', padding: '0.9rem 2.5rem', fontSize: '1rem', cursor: 'pointer', border: 'none' }}
                >
                  Enviar mensaje ➔
                </button>
              </form>
            )}
          </div>

          {/* Mapa */}
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--glass-border)', minHeight: '400px' }}>
            <iframe
              title="Ubicación SanSah Bikes"
              src="https://www.google.com/maps?q=Plaza+Ana,+Zamora,+Michoacán,+México&output=embed"
              width="100%"
              height="100%"
              style={{ display: 'block', minHeight: '400px', border: 'none' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
