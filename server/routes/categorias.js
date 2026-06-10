const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const upload = require('../utils/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');

// GET /api/categorias
router.get('/', async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({ orderBy: { id: 'desc' } });
    res.json(categorias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// GET /api/categorias/:id
router.get('/:id', async (req, res) => {
  try {
    const cat = await prisma.categoria.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!cat) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
});

// POST /api/categorias
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    let imagen_url = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'categorias');
      imagen_url = result.secure_url;
    }
    const { nombre, publico } = req.body;
    const cat = await prisma.categoria.create({
      data: {
        nombre,
        imagen_url,
        publico: publico === 'true' || publico === true,
      }
    });
    res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// PUT /api/categorias/:id
router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.categoria.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Categoría no encontrada' });

    let imagen_url = existing.imagen_url;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'categorias');
      imagen_url = result.secure_url;
    }
    const { nombre, publico } = req.body;
    const cat = await prisma.categoria.update({
      where: { id },
      data: {
        nombre,
        imagen_url,
        publico: publico === 'true' || publico === true,
      }
    });
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

// DELETE /api/categorias/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.categoria.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

module.exports = router;
