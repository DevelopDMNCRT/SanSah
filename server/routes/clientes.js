const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Genera un código único de 5 caracteres alfanuméricos
async function generarCodigo() {
  let codigo, existe = true;
  while (existe) {
    codigo = String(Math.floor(10000 + Math.random() * 90000)); // 5 dígitos: 10000–99999
    existe = await prisma.cliente.findUnique({ where: { codigo } });
  }
  return codigo;
}

// GET /api/clientes
// Devuelve lista de clientes con conteo de pedidos y total gastado
router.get('/', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: { pedidos: { select: { id: true, total: true, created_at: true } } },
      orderBy: { created_at: 'desc' }
    });

    const data = clientes.map(c => ({
      id: c.id,
      codigo: c.codigo,
      nombre: c.nombre,
      correo: c.correo,
      telefono: c.telefono,
      primera_compra: c.created_at,  // Fecha de alta = siempre disponible
      ultima_compra: c.pedidos.length
        ? c.pedidos.reduce((newest, p) =>
            p.created_at > newest.created_at ? p : newest
          ).created_at
        : null,
      total_pedidos: c.pedidos.length,
      total_gastado: c.pedidos.reduce((sum, p) => sum + p.total, 0),
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// GET /api/clientes/buscar?q=nombre  — búsqueda para autocomplete del Taller
router.get('/buscar', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const clientes = await prisma.cliente.findMany({
      where: { nombre: { contains: q, mode: 'insensitive' } },
      select: { id: true, nombre: true, telefono: true },
      take: 8,
      orderBy: { nombre: 'asc' }
    });
    res.json(clientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar clientes' });
  }
});

// GET /api/clientes/:correo  — detalle con pedidos del cliente (usado por ClienteDetalle.vue)
router.get('/:correo', async (req, res) => {
  try {
    const correo = decodeURIComponent(req.params.correo);
    const pedidos = await prisma.pedido.findMany({
      where: { correo },
      include: { items: true },
      orderBy: { created_at: 'desc' }
    });
    if (!pedidos.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener detalle del cliente' });
  }
});

// POST /api/clientes — crear cliente manual
router.post('/', async (req, res) => {
  try {
    const { nombre, correo, telefono } = req.body;
    const codigo = await generarCodigo();
    const cliente = await prisma.cliente.create({ data: { codigo, nombre, correo: correo || null, telefono } });
    res.status(201).json(cliente);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') return res.status(409).json({ error: 'Ya existe un cliente con ese correo' });
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// PUT /api/clientes/:id
router.put('/:id', async (req, res) => {
  try {
    const { nombre, telefono } = req.body;
    const cliente = await prisma.cliente.update({
      where: { id: parseInt(req.params.id) },
      data: { nombre, telefono }
    });
    res.json(cliente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// DELETE /api/clientes/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.cliente.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;
