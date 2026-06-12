const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/gastos
router.get('/', async (req, res) => {
  try {
    const gastos = await prisma.gasto.findMany({
      orderBy: { fecha: 'desc' }
    });
    res.json(gastos);
  } catch (error) {
    console.error('Error GET /gastos:', error);
    res.status(500).json({ error: 'Error al obtener los gastos' });
  }
});

// POST /api/gastos
router.post('/', async (req, res) => {
  try {
    const { concepto, monto, categoria, fecha, notas } = req.body;
    
    if (!concepto || monto === undefined || !categoria) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevoGasto = await prisma.gasto.create({
      data: {
        concepto,
        monto: parseFloat(monto),
        categoria,
        fecha: (fecha && fecha.trim()) ? new Date(fecha) : new Date(),
        notas: notas || null
      }
    });

    res.status(201).json(nuevoGasto);
  } catch (error) {
    console.error('Error POST /gastos:', error);
    res.status(500).json({ error: 'Error al registrar el gasto' });
  }
});

// PUT /api/gastos/:id
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { concepto, monto, categoria, fecha, notas } = req.body;

    const gastoAct = await prisma.gasto.update({
      where: { id },
      data: {
        concepto,
        monto: monto !== undefined ? parseFloat(monto) : undefined,
        categoria,
        fecha: fecha ? new Date(fecha) : undefined,
        notas: notas !== undefined ? notas : undefined
      }
    });

    res.json(gastoAct);
  } catch (error) {
    console.error('Error PUT /gastos/:id:', error);
    res.status(500).json({ error: 'Error al actualizar el gasto' });
  }
});

// DELETE /api/gastos/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.gasto.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error DELETE /gastos/:id:', error);
    res.status(500).json({ error: 'Error al eliminar el gasto' });
  }
});

module.exports = router;
