const categoriesList = [
  "Bicicletas", "Zapatos", "Cascos", "Llantas", "Transmision", 
  "Frenos", "Pedales", "Asientos", "Ropa", "Horquillas y Shock", 
  "Accesorios", "Ofertas", "Mas"
];

const imagesByCategory = {
  Bicicletas: '/mtb_bike_premium.png',
  Zapatos: '/mtb_shoes_premium.png',
  Cascos: '/mtb_helmet_premium.png',
  Llantas: 'https://images.unsplash.com/photo-1580902890695-103ef7956417?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  Transmision: '/mtb_fork_premium.png', // Reusing fork as generic transmission components
  Frenos: 'https://images.unsplash.com/photo-1496150590317-f8d952453e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  Horquillas_y_Shock: '/mtb_fork_premium.png',
  Default: '/mtb_bike_premium.png'
};

const products = [];
let idCounter = 1;

categoriesList.forEach((cat) => {
  // Generate 25 products per category
  for (let i = 1; i <= 25; i++) {
    products.push({
      id: idCounter++,
      title: `${cat} Premium Modelo ${i}`,
      category: cat,
      price: `$${(Math.random() * 500 + 50).toFixed(2)}`,
      img: imagesByCategory[cat] || imagesByCategory['Default'],
      badge: i === 1 || i === 5 ? 'NUEVO' : null
    });
  }
});

// A few custom ones for the home page
export const featuredProducts = products.filter((p, i) => i % 50 === 0).slice(0, 4);

export default products;
