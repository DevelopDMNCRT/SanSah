const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/reportes/ventas
router.get('/ventas', async (req, res) => {
  try {
    const { tienda_id } = req.query; // Puede ser 'todas' u omitido
    
    // Obtener pedidos completados para calcular ingresos
    const pedidos = await prisma.pedido.findMany({
      where: { estado: 'Completado' },
      include: { items: true },
      orderBy: { created_at: 'desc' }
    });

    // Calcular ingreso neto total
    const ingresoNeto = pedidos.reduce((sum, p) => sum + p.total, 0);

    // Agrupar por forma de pago
    const pagosMap = {};
    pedidos.forEach(p => {
      const metodo = p.metodo_pago || 'Otro';
      pagosMap[metodo] = (pagosMap[metodo] || 0) + p.total;
    });

    // Agrupar por canal de venta
    const canalesMap = {};
    pedidos.forEach(p => {
      const canal = p.canal_venta || 'Otro';
      canalesMap[canal] = (canalesMap[canal] || 0) + p.total;
    });

    // Calcular top 5 productos vendidos (sumando cantidades de items)
    const productosMap = {};
    pedidos.forEach(p => {
      p.items.forEach(item => {
        let nombre = item.nombre;
        if (nombre.startsWith('Servicio:')) {
          nombre = 'Servicio de Taller';
        }
        productosMap[nombre] = (productosMap[nombre] || 0) + item.cantidad;
      });
    });

    // Convertir a arrays ordenados y limitar a 5
    const topProductos = Object.entries(productosMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Preparar filas para la tabla (rows)
    // Para no generar una fila por item y repetir pedidos, generamos una fila consolidada por pedido,
    // usando el producto con más valor o simplemente el primero como "Producto Principal".
    const rows = pedidos.map(p => {
      const d = new Date(p.created_at);
      const fechaFormat = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
      
      let productoPrincipal = p.items.length > 0 ? p.items[0].nombre : 'Varios / Servicio';
      if (productoPrincipal.startsWith('Servicio:')) {
        productoPrincipal = 'Servicio de Taller';
      }
      
      return {
        fecha: fechaFormat,
        producto: p.items.length > 1 ? `${productoPrincipal} (+${p.items.length - 1} más)` : productoPrincipal,
        canal: p.canal_venta || 'Otro',
        pago: p.metodo_pago || 'Otro',
        total: p.total
      };
    });

    // --- EGRESOS (Gastos y Compras de Stock) ---
    const gastos = await prisma.gasto.findMany();
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);

    const comprasStock = await prisma.inventarioMovimiento.findMany({
      where: { tipo: 'entrada' }
    });
    
    let comprasEfectivo = 0;
    let comprasTarjeta = 0;
    let comprasTransferencia = 0;
    let comprasOtro = 0;

    comprasStock.forEach(c => {
      const costo = c.costo_unitario ? c.costo_unitario * c.cantidad : 0;
      const forma = (c.forma_pago || 'Otro').toLowerCase();
      if (forma === 'efectivo') comprasEfectivo += costo;
      else if (forma === 'tarjeta') comprasTarjeta += costo;
      else if (forma === 'transferencia' || forma === 'transf.') comprasTransferencia += costo;
      else comprasOtro += costo;
    });

    const totalCompras = comprasEfectivo + comprasTarjeta + comprasTransferencia + comprasOtro;
    const egresoTotal = totalGastos + totalCompras;

    const egresosDesgloseMap = {
      'Gastos': totalGastos,
      'Compras (Efectivo)': comprasEfectivo,
      'Compras (Tarjeta)': comprasTarjeta,
      'Compras (Transferencia)': comprasTransferencia,
    };
    if (comprasOtro > 0) egresosDesgloseMap['Compras (Otro)'] = comprasOtro;
    
    // Eliminar valores en 0
    Object.keys(egresosDesgloseMap).forEach(k => {
      if (egresosDesgloseMap[k] === 0) delete egresosDesgloseMap[k];
    });

    res.json({
      ingreso_neto: ingresoNeto,
      egreso_total: egresoTotal,
      ingresos_forma_pago: {
        labels: Object.keys(pagosMap),
        series: Object.values(pagosMap)
      },
      ingresos_canal: {
        labels: Object.keys(canalesMap),
        series: Object.values(canalesMap)
      },
      egresos_desglose: {
        labels: Object.keys(egresosDesgloseMap),
        series: Object.values(egresosDesgloseMap)
      },
      top_productos: {
        labels: topProductos.map(t => t[0]),
        series: topProductos.map(t => t[1])
      },
      rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar reporte de ventas' });
  }
});

module.exports = router;
