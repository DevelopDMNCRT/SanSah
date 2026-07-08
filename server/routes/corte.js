const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/corte — Obtener el corte de caja de un día específico
router.get('/', async (req, res) => {
  try {
    const { fecha } = req.query; // Formato YYYY-MM-DD
    if (!fecha) {
      return res.status(400).json({ error: 'Falta el parámetro fecha (YYYY-MM-DD)' });
    }

    const start = new Date(fecha + 'T00:00:00.000');
    const end = new Date(fecha + 'T23:59:59.999');

    // Obtener pedidos del día que no estén cancelados
    const pedidos = await prisma.pedido.findMany({
      where: {
        created_at: {
          gte: start,
          lte: end
        },
        estado: {
          notIn: ['Cancelado', 'Devuelto']
        }
      },
      include: {
        items: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    let tarjetas = 0;
    let transferencias = 0;
    let efectivo = 0;
    let sitio_web = 0;

    pedidos.forEach(p => {
      if (p.canal_venta === 'Tienda en Línea') {
        sitio_web += p.total;
      } else {
        const metodo = (p.metodo_pago || '').toLowerCase();
        if (metodo.includes('tarjeta')) {
          tarjetas += p.total;
        } else if (metodo.includes('transfer') || metodo.includes('transf')) {
          transferencias += p.total;
        } else if (metodo.includes('efectivo') || metodo.includes('efe')) {
          efectivo += p.total;
        } else {
          // Por defecto si no coincide lo catalogamos en efectivo o tarjetas, o podemos crear un fallback.
          // Digamos efectivo para evitar pérdidas
          efectivo += p.total;
        }
      }
    });

    const total = tarjetas + transferencias + efectivo + sitio_web;

    res.json({
      resumen: {
        tarjetas,
        transferencias,
        efectivo,
        sitio_web,
        total
      },
      ventas: pedidos.map(p => ({
        id: p.id,
        orden: p.orden,
        nombre: p.nombre,
        metodo_pago: p.metodo_pago,
        canal_venta: p.canal_venta,
        total: p.total,
        created_at: p.created_at,
        taller: p.items.some(item => (item.nombre || '').startsWith('Servicio:'))
      }))
    });

  } catch (error) {
    console.error('Error en GET /api/corte:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar el corte' });
  }
});

module.exports = router;
