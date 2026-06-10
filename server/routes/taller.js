const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    const { cliente, bicicleta, telefono, descripcion, costo, fecha } = req.body;
    
    const numero = await generarOrdenTaller();
    
    const orden = await prisma.ordenTaller.create({
      data: {
        numero,
        cliente,
        bicicleta: bicicleta || null,
        telefono: telefono || null,
        descripcion,
        costo: parseFloat(costo) || 0,
        estado: 'recibido',
        fecha: fecha || null
      }
    });
    
    res.status(201).json(orden);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear orden de taller' });
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
