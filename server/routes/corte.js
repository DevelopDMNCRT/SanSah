const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { requireAuth } = require('./auth');

// GET /api/corte — Obtener el corte de caja de un día específico
router.get('/', requireAuth, async (req, res) => {
  try {
    const { fecha, cajero_id } = req.query; // Formato YYYY-MM-DD
    if (!fecha) {
      return res.status(400).json({ error: 'Falta el parámetro fecha (YYYY-MM-DD)' });
    }

    const start = new Date(fecha + 'T00:00:00.000');
    const end = new Date(fecha + 'T23:59:59.999');

    const isUserAdmin = (req.user && req.user.rol === 'Administrador');

    // Construir filtro de búsqueda
    const whereClause = {
      created_at: {
        gte: start,
        lte: end
      },
      estado: {
        notIn: ['Cancelado', 'Devuelto']
      }
    };

    // Si NO es Admin (es Operativo), solo ve sus propios movimientos
    if (!isUserAdmin) {
      whereClause.usuario_id = req.user.id;
    } else if (cajero_id && cajero_id !== 'todos') {
      // Si es Admin y filtró por un cajero específico
      whereClause.usuario_id = parseInt(cajero_id);
    }

    // Obtener pedidos del día
    const pedidos = await prisma.pedido.findMany({
      where: whereClause,
      include: {
        items: true,
        usuario: {
          select: {
            id: true,
            nombre: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Si es admin, obtenemos la lista de usuarios/cajeros registrados para el dropdown
    let cajerosList = [];
    if (isUserAdmin) {
      cajerosList = await prisma.user.findMany({
        select: {
          id: true,
          nombre: true,
          rol: true
        },
        orderBy: {
          nombre: 'asc'
        }
      });
    }

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
          efectivo += p.total;
        }
      }
    });

    const total = tarjetas + transferencias + efectivo + sitio_web;

    res.json({
      es_admin: isUserAdmin,
      cajeros: cajerosList,
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
        cajero: p.usuario ? p.usuario.nombre : 'Venta General',
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
