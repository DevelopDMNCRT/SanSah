const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendEmail } = require('../utils/email');

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

    let emailEnviado = false;

    if (estado === 'En proceso' && pedido.correo && !pedido.correo.endsWith('@sansah.local')) {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #101828; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">SanSah Bikes</h1>
          </div>
          <div style="padding: 30px 20px; color: #374151;">
            <h2 style="color: #111827; font-size: 20px; margin-top: 0;">¡Tu pedido está en proceso!</h2>
            <p>Hola <strong>${pedido.nombre}</strong>,</p>
            <p>Te informamos que tu pedido <strong>#${pedido.orden}</strong> ha cambiado de estado y ahora está <strong>En proceso</strong>.</p>
            <p>Estamos trabajando para tenerlo listo lo antes posible. Te notificaremos nuevamente cuando haya más actualizaciones.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">Gracias por elegir SanSah Bikes</p>
            </div>
          </div>
        </div>
      `;
      
      emailEnviado = await sendEmail(
        pedido.correo,
        `Tu pedido #${pedido.orden} está En proceso - SanSah Bikes`,
        htmlContent
      );
    }

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
