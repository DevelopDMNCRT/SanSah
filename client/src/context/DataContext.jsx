import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || '';
        // Fetch categories (tiendas)
        const catRes = await fetch(`${API_URL}/api/tiendas`);
        if (!catRes.ok) throw new Error('Error al cargar tiendas');
        const catData = await catRes.json();
        
        // Map categories for the UI
        const mappedCategories = catData.map(t => ({
          title: t.nombre,
          image: t.imagen_url || 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=2070&auto=format&fit=crop',
          link: `/categoria/${t.nombre.toLowerCase().replace(/\s+/g, '-')}`,
          count: t.publico === false ? 'Privada' : 'Explorar',
          raw: t
        }));
        setCategories(mappedCategories);

        // Fetch products
        const prodRes = await fetch(`${API_URL}/api/products`);
        if (!prodRes.ok) throw new Error('Error al cargar productos');
        const prodData = await prodRes.json();

        // Map products for the UI
        const mappedProducts = prodData.map(p => ({
          id: p.id,
          title: p.nombre,
          category: p.tienda || 'General',
          price: `$${parseFloat(p.precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          img: p.imagen_url || 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=2070&auto=format&fit=crop',
          badge: p.destacado ? 'DESTACADO' : (p.estado === 'Agotado' ? 'AGOTADO' : null),
          raw: p
        }));
        setProducts(mappedProducts);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ products, categories, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
