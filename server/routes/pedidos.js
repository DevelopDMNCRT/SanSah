const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Genera un código único de 5 caracteres alfanuméricos para nuevos clientes
async function generarCodigo() {
  let codigo, existe = true;
  while (existe) {
    codigo = String(Math.floor(10000 + Math.random() * 90000));
    existe = await prisma.cliente.findUnique({ where: { codigo } });
  }
  return codigo;
}

// Genera número de orden, ej: ORD-1001
async function generarOrden() {
  const ultimo = await prisma.pedido.findFirst({ orderBy: { id: 'desc' }, select: { id: true } });
  const siguiente = (ultimo?.id ?? 0) + 1;
  return `ORD-${String(1000 + siguiente).padStart(4, '0')}`;
}

// Estados que disparan correo al cliente
const EMAIL_TRIGGERS = new Set(['En proceso', 'Completado', 'Cancelado', 'Fallido']);

// GET /api/pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: { items: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// GET /api/pedidos/:id
router.get('/:id', async (req, res) => {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { items: true }
    });
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
});

// POST /api/pedidos  — Crear pedido (viene del proceso de compra del cliente o POS)
router.post('/', async (req, res) => {
  try {
    const { 
      nombre, correo, telefono, ciudad, domicilio, notas, 
      envio, total, items, metodo_pago, canal_venta, estado 
    } = req.body;

    const nombreReal = nombre || 'Cliente Mostrador';
    let cliente = null;

    if (correo) {
      cliente = await prisma.cliente.findUnique({ where: { correo } });
      if (!cliente) {
        const codigo = await generarCodigo();
        cliente = await prisma.cliente.create({ data: { codigo, nombre: nombreReal, correo, telefono } });
      }
    } else {
      cliente = await prisma.cliente.findFirst({ where: { nombre: nombreReal } });
      if (!cliente) {
        const codigo = await generarCodigo();
        cliente = await prisma.cliente.create({ data: { codigo, nombre: nombreReal, correo: null, telefono } });
      } else if (telefono && !cliente.telefono) {
        cliente = await prisma.cliente.update({ where: { id: cliente.id }, data: { telefono } });
      }
    }

    const emailReal = correo || cliente.correo || 'pos@sansah.com';

    const orden = await generarOrden();

    const pedido = await prisma.pedido.create({
      data: {
        orden,
        cliente_id: cliente.id,
        nombre: nombreReal,
        correo: emailReal,
        telefono: telefono || null,
        ciudad: ciudad || null,
        domicilio: domicilio || null,
        notas: notas || null,
        estado: estado || 'Nuevo',
        envio: parseFloat(envio) || 0,
        total: parseFloat(total),
        metodo_pago: metodo_pago || 'Tarjeta de Crédito',
        canal_venta: canal_venta || 'Tienda en Línea',
        items: {
          create: (items || []).map(item => ({
            nombre: item.nombre,
            variante: item.variante || null,
            cantidad: parseInt(item.cantidad) || 1,
            precio: parseFloat(item.precio),
            imagen: item.imagen || null,
          }))
        }
      },
      include: { items: true }
    });

    res.status(201).json(pedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear pedido', details: err.message });
  }
});

// PUT /api/pedidos/:id  — Actualizar datos generales
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, correo, telefono, ciudad, domicilio, notas, estado, envio, total } = req.body;
    const pedido = await prisma.pedido.update({
      where: { id },
      data: { nombre, correo, telefono, ciudad, domicilio, notas, estado, envio: parseFloat(envio), total: parseFloat(total) },
      include: { items: true }
    });
    res.json(pedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

// PUT /api/pedidos/:id/estado  — Cambiar solo el estado (usado por PedidoDetalle.vue)
router.put('/:id/estado', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { estado } = req.body;

    const pedido = await prisma.pedido.update({
      where: { id },
      data: { estado }
    });

    // Aquí se podría disparar un correo al cliente si EMAIL_TRIGGERS.has(estado)
    const emailEnviado = false; // TODO: integrar Nodemailer/Resend cuando sea necesario

    res.json({ ...pedido, emailEnviado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// DELETE /api/pedidos/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.pedido.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
});

module.exports = router;
