import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

const ProductGrid = () => {
  const { products, loading } = useData();
  const { addToCart } = useCart();
  
  const featuredProducts = products.filter(p => p.badge === 'DESTACADO');
  const displayProducts = featuredProducts.length > 0 ? featuredProducts.slice(0, 4) : products.slice(0, 4);

  if (loading) {
    return <p style={{textAlign: 'center', padding: '2rem'}}>Cargando productos...</p>;
  }

  return (
    <section className="section-padding container">
      <div className="products-header">
        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Destacados Semanales</h2>
        <Link to="/categoria/ofertas" style={{ color: 'var(--brand-primary)', fontWeight: 'bold' }}>Ver todo el catálogo →</Link>
      </div>

      <div className="products-grid">
        {displayProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-img-wrapper" style={{ cursor: 'pointer' }}>
              <Link to={`/producto/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <img src={product.img} alt={product.title} />
              </Link>
            </div>
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 className="product-title">{product.title}</h3>
              </Link>
              <div className="product-footer">
                <span className="product-price">{product.price}</span>
                <button 
                  className="cart-btn" 
                  aria-label="Añadir al carrito"
                  onClick={() => addToCart(product)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
