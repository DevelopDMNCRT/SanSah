const categoriesList: string[] = [
  "Bicicletas", "Zapatos", "Cascos", "Llantas", "Transmision", 
  "Frenos", "Pedales", "Asientos", "Ropa", "Horquillas y Shock", 
  "Accesorios", "Ofertas", "Mas"
];

const imagesByCategory: Record<string, string> = {
  Bicicletas: '/mtb_bike_premium.png',
  Zapatos: '/mtb_shoes_premium.png',
  Cascos: '/mtb_helmet_premium.png',
  Llantas: 'https://images.unsplash.com/photo-1580902890695-103ef7956417?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  Transmision: '/mtb_fork_premium.png',
  Frenos: 'https://images.unsplash.com/photo-1496150590317-f8d952453e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  Horquillas_y_Shock: '/mtb_fork_premium.png',
  Default: '/mtb_bike_premium.png'
};

const generateProducts = () => {
  const prods: any[] = [];
  let id = 1;
  categoriesList.forEach((cat) => {
    for (let i = 1; i <= 15; i++) {
      prods.push({
        id: id++,
        nombre: `${cat} Premium Modelo ${i}`,
        descripcion: `El mejor componente de la categoría ${cat} para tu bicicleta, garantizando un rendimiento óptimo en la pista o montaña.`,
        tienda: cat,
        flag: i === 1 || i === 5 ? 'NUEVO' : null,
        precio: parseFloat((Math.random() * 500 + 50).toFixed(2)),
        stock: Math.floor(Math.random() * 50) + 10,
        es_variable: false,
        es_publico: true,
        slug: `${cat.toLowerCase().replace(/\s+/g, '-')}-premium-${i}`,
        imagen_url: imagesByCategory[cat] || imagesByCategory['Default'],
        galeria_urls: [],
        atributos: [],
        variaciones: []
      });
    }
  });
  return prods;
};

const initialData = {
  products: generateProducts(),
  tiendas: [
    { id: 1, nombre: "General", icono: "Store" },
    { id: 2, nombre: "Bicicletas", icono: "Bike" },
    { id: 3, nombre: "Accesorios", icono: "Helmet" },
  ],
  users: [
    { id: 1, name: "Admin Sansah", email: "admin@sansah.com", role: "admin", status: "Active" }
  ],
  clientes: [
    { id: 1, nombre: "Juan Perez", correo: "juan@example.com", telefono: "5551234567", pedidos_count: 2, total_gastado: 6350 }
  ],
  pedidos: [
    { id: 1, codigo: "PED-001", cliente_nombre: "Juan Perez", fecha: new Date().toISOString(), total: 6350, estado: "completado" }
  ],
  reportes_ventas: {
    ingreso_neto: 125430,
    ingresos_forma_pago: {
      labels: ['Tarjeta de Crédito', 'Tarjeta de Débito', 'Efectivo', 'Transferencia'],
      series: [45000, 30000, 25430, 25000]
    },
    ingresos_canal: {
      labels: ['Tienda en Línea', 'Punto de Venta (POS)'],
      series: [85000, 40430]
    },
    top_productos: {
      labels: ['Bicicleta Montaña R29', 'Casco Seguridad', 'Luces LED Delanteras', 'Cadena KMC', 'Bomba de Aire'],
      series: [15, 25, 30, 12, 10]
    },
    rows: [
      { fecha: "01/06/2026", producto: "Bicicleta Montaña R29", canal: "Tienda en Línea", pago: "Tarjeta de Crédito", total: 5500 },
      { fecha: "02/06/2026", producto: "Casco Seguridad", canal: "POS", pago: "Efectivo", total: 850 },
      { fecha: "03/06/2026", producto: "Luces LED Delanteras", canal: "Tienda en Línea", pago: "Transferencia", total: 450 },
      { fecha: "04/06/2026", producto: "Cadena KMC", canal: "POS", pago: "Tarjeta de Débito", total: 350 },
      { fecha: "05/06/2026", producto: "Bomba de Aire", canal: "Tienda en Línea", pago: "Tarjeta de Crédito", total: 250 },
    ],
  },
  boletines: [],
  suscriptores: []
};

export function getDB(): any {
  const data = localStorage.getItem("sansah_demo_db");
  if (data) {
    const parsed = JSON.parse(data);
    parsed.reportes_ventas = initialData.reportes_ventas;
    parsed.products = initialData.products;
    return parsed;
  }
  localStorage.setItem("sansah_demo_db", JSON.stringify(initialData));
  return initialData;
}

export function saveDB(db: any) {
  localStorage.setItem("sansah_demo_db", JSON.stringify(db));
}
