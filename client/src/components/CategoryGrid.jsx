import React from 'react';
import { Link } from 'react-router-dom';

const defaultCategories = [
  { title: 'Bicicletas', image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=2070&auto=format&fit=crop', link: '/categoria/bicicletas', count: 'Mountain & Road' },
  { title: 'Cascos', image: 'https://images.unsplash.com/photo-1557171202-0c918ec3fdf7?q=80&w=2070&auto=format&fit=crop', link: '/categoria/cascos', count: 'Professional Safety' },
  { title: 'Zapatos', image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?q=80&w=2070&auto=format&fit=crop', link: '/categoria/zapatos', count: 'Power Transfer' },
  { title: 'Ropa', image: 'https://images.unsplash.com/photo-1541625602330-2277a1cd1f59?q=80&w=2070&auto=format&fit=crop', link: '/categoria/ropa', count: 'Performance Wear' },
  { title: 'Componentes', image: 'https://images.unsplash.com/photo-1594738525345-ccbb58371cc5?q=80&w=2070&auto=format&fit=crop', link: '/categoria/transmision', count: 'Drivetrain & More' },
  { title: 'Llantas', image: 'https://images.unsplash.com/photo-1629853903154-150993510522?q=80&w=2070&auto=format&fit=crop', link: '/categoria/llantas', count: 'Grip & Speed' },
  { title: 'Accesorios', image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2070&auto=format&fit=crop', link: '/categoria/accesorios', count: 'Essential Gear' },
  { title: 'Ofertas', image: 'https://images.unsplash.com/photo-1571173200318-77a83707ed54?q=80&w=2072&auto=format&fit=crop', link: '/categoria/ofertas', count: 'Hot Deals' }
];
import { useData } from '../context/DataContext';

const CategoryGrid = () => {
  const { categories, loading } = useData();

  if (loading) {
    return (
      <section className="section-padding" style={{ background: '#fafafa', textAlign: 'center' }}>
        <p>Cargando categorías...</p>
      </section>
    );
  }
  return (
    <section className="section-padding" style={{ background: '#fafafa' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="hero-tag">Explora</span>
          <h2 style={{ fontSize: '3rem', marginTop: '0.5rem', color: '#0a0a0a' }}>Nuestras Categorías</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Encuentra todo lo que necesitas para tu próxima aventura, desde 
            componentes de alta precisión hasta indumentaria técnica.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((cat, idx) => (
            <Link to={cat.link} key={idx} className="category-card">
              <div className="category-image">
                <img src={cat.image} alt={cat.title} />
                <div className="category-overlay"></div>
              </div>
              <div className="category-content">
                <span className="category-count">{cat.count}</span>
                <h3 className="category-title">{cat.title}</h3>
                <span className="category-btn">Ver Catálogo ➔</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
