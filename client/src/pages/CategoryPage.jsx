import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

const CategoryPage = () => {
  const { catName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { addToCart } = useCart();
  const { products, loading, error } = useData();

  const normalizeString = (str) => {
    if (!str) return '';
    return decodeURIComponent(str)
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/\s+/g, '-');
  };

  const normalizedCatName = normalizeString(catName);

  // Filter products by category 
  const categoryProducts = products.filter(p => {
    const pCat = normalizeString(p.category);
    return pCat === normalizedCatName;
  });

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [catName]);

  const totalPages = Math.ceil(categoryProducts.length / itemsPerPage);
  
  // Get slice for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = categoryProducts.slice(startIndex, startIndex + itemsPerPage);

  const formatTitle = (str) => {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="page-transition category-page-container">
      <div className="container section-padding" style={{ paddingTop: '120px' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <Link to="/" style={{ color: 'var(--brand-primary)', marginRight: '5px' }}>Inicio</Link> 
            / Catálogo / {formatTitle(catName)}
          </p>
          <h1 style={{ fontSize: '3.5rem', color: 'var(--text-accent)'}}>{formatTitle(catName)}</h1>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando productos...</p>
        ) : error ? (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        ) : categoryProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>No se encontraron productos en esta categoría.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {currentItems.map((product) => (
                <div key={product.id} className="product-card" style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}>
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
                      {product.raw?.es_variable ? (
                        <Link to={`/producto/${product.id}`} className="cart-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-primary)' }} title="Ver Opciones">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </Link>
                      ) : (
                        <button 
                          className="cart-btn" 
                          aria-label="Añadir al carrito"
                          onClick={() => addToCart(product)}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="page-btn"
                >
                  &laquo; Anterior
                </button>
                
                <div className="page-numbers">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button 
                      key={idx} 
                      className={`page-num-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="page-btn"
                >
                  Siguiente &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
