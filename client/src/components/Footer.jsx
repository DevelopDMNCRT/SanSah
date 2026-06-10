import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
              <img src="/logo.png" alt="SanSah Bikes" style={{ maxHeight: '60px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              <div className="logo-fallback" style={{ fontSize: '1.5rem', display: 'none' }}>
                SANSAH<span style={{ color: '#D6D6D6', marginLeft: '5px' }}>BIKES</span>
              </div>
            </Link>
            <p className="footer-desc">
              Pasión por el ciclismo. Todo lo que necesitas para tu próxima aventura sobre dos ruedas, con calidad garantizada.
            </p>
          </div>
          <div>
            <h4 className="footer-title">Categorías</h4>
            <ul className="footer-links">
              <li><Link to="/categoria/bicicletas">Bicicletas</Link></li>
              <li><Link to="/categoria/accesorios">Accesorios</Link></li>
              <li><Link to="/categoria/ropa">Ropa</Link></li>
              <li><Link to="/categoria/transmision">Refacciones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Soporte</h4>
            <ul className="footer-links">
              <li><Link to="/contacto">Envíos y Entregas</Link></li>
              <li><Link to="/contacto">Garantías</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Redes Sociales</h4>
            <ul className="footer-links">
              <li>
                <a href="https://www.instagram.com/sansahbikes?igsh=MWxyZWtjazRteWIzbA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8811E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4l0 -8" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M16.5 7.5v.01" /></svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/1BRAxHXine/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8811E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" /></svg>
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@sansahbikes?_r=1&_t=ZS-95XUXJdaK2O" target="_blank" rel="noopener noreferrer" style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8811E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 12a4 4 0 1 0 4 4v-12a5 5 0 0 0 5 5" /></svg>
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} SanSah Bikes. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
