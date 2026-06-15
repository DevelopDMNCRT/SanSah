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

// Genera un número de orden OS-001, OS-002, etc.
async function generarOrdenTaller() {
  const ultimo = await prisma.ordenTaller.findFirst({ orderBy: { id: 'desc' }, select: { id: true } });
  const siguiente = (ultimo?.id ?? 0) + 1;
  return `OS-${String(siguiente).padStart(3, '0')}`;
}

// GET /api/taller — Obtener todas las órdenes de taller
router.get('/', async (req, res) => {
  try {
    const ordenes = await prisma.ordenTaller.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(ordenes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener órdenes de taller' });
  }
});

// POST /api/taller — Crear una nueva orden de servicio
router.post('/', async (req, res) => {
  try {
    const { cliente, bicicleta, telefono, descripcion, costo, servicio, fecha } = req.body;
    
    const nombreReal = cliente || 'Cliente Mostrador';
    let clienteDb = await prisma.cliente.findFirst({ where: { nombre: nombreReal } });
    if (!clienteDb) {
      const codigo = await generarCodigo();
      clienteDb = await prisma.cliente.create({ data: { codigo, nombre: nombreReal, correo: null, telefono } });
    } else if (telefono && !clienteDb.telefono) {
      clienteDb = await prisma.cliente.update({ where: { id: clienteDb.id }, data: { telefono } });
    }

    const numero = await generarOrdenTaller();
    
    const orden = await prisma.ordenTaller.create({
      data: {
        numero,
        cliente,
        bicicleta: bicicleta || null,
        telefono: telefono || null,
        descripcion,
        costo: parseFloat(costo) || 0,
        servicio: servicio || null,
        estado: 'recibido',
        fecha: fecha || null
      }
    });
    
    res.status(201).json(orden);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear orden de taller', details: err.message });
  }
});

// PUT /api/taller/:id/estado — Cambiar estado de una orden
router.put('/:id/estado', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { estado } = req.body;
    
    const orden = await prisma.ordenTaller.update({
      where: { id },
      data: { estado }
    });
    
    res.json(orden);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estado de la orden' });
  }
});

// PUT /api/taller/:id/detalles — Actualizar piezas y descripción
router.put('/:id/detalles', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { descripcion, piezas, costo } = req.body;
    
    const dataToUpdate = {};
    if (descripcion !== undefined) dataToUpdate.descripcion = descripcion;
    if (piezas !== undefined) dataToUpdate.piezas = piezas;
    if (costo !== undefined) dataToUpdate.costo = parseFloat(costo) || 0;

    const orden = await prisma.ordenTaller.update({
      where: { id },
      data: dataToUpdate
    });
    
    res.json(orden);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar detalles de la orden' });
  }
});

// DELETE /api/taller/:id — Borrar una orden (ej. al completarse/cobrarse)
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.ordenTaller.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar orden' });
  }
});

module.exports = router;
