const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma   = new PrismaClient();

// ─── Helper: valida formato de correo electrónico ─────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esEmailValido = (correo) => EMAIL_REGEX.test(String(correo).toLowerCase());

// ─── GET /api/users ───────────────────────────────────────────────────────────
// Lista todos los usuarios (sin exponer el password)
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id:         true,
        nombre:     true,
        correo:     true,
        rol:        true,
        created_at: true,
        updated_at: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
// Obtiene un usuario por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id:         true,
        nombre:     true,
        correo:     true,
        rol:        true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error(`GET /api/users/${req.params.id} error:`, err);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// ─── POST /api/users ──────────────────────────────────────────────────────────
// Crea un nuevo usuario
router.post('/', async (req, res) => {
  const { nombre, correo, rol, password } = req.body;

  // Validaciones básicas
  if (!nombre || !correo || !rol || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  if (!esEmailValido(correo)) {
    return res.status(400).json({ error: 'El formato del correo electrónico no es válido' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
  }

  try {
    // Verificar si el correo ya está en uso
    const existing = await prisma.user.findUnique({ where: { correo } });
    if (existing) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Generate a random 4-digit ID that doesn't exist yet
    let newId;
    let isUnique = false;
    while (!isUnique) {
      newId = Math.floor(Math.random() * 9000) + 1000; // 1000 - 9999
      const existingId = await prisma.user.findUnique({ where: { id: newId } });
      if (!existingId) {
        isUnique = true;
      }
    }

    const user = await prisma.user.create({
      data: { id: newId, nombre, correo, rol, password: hashed },
      select: {
        id:         true,
        nombre:     true,
        correo:     true,
        rol:        true,
        created_at: true,
        updated_at: true,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error('POST /api/users error:', err);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
// Actualiza un usuario existente
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { nombre, correo, rol, password } = req.body;

  if (!nombre || !correo || !rol) {
    return res.status(400).json({ error: 'nombre, correo y rol son requeridos' });
  }
  if (!esEmailValido(correo)) {
    return res.status(400).json({ error: 'El formato del correo electrónico no es válido' });
  }

  try {
    // Verificar que el usuario exista
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Verificar que el correo no esté tomado por otro usuario
    const emailTaken = await prisma.user.findFirst({
      where: { correo, NOT: { id } },
    });
    if (emailTaken) {
      return res.status(409).json({ error: 'El correo ya está en uso por otro usuario' });
    }

    const data = { nombre, correo, rol };

    // Solo actualizar password si se proporcionó uno
    if (password && password.length > 0) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
      }
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id:         true,
        nombre:     true,
        correo:     true,
        rol:        true,
        created_at: true,
        updated_at: true,
      },
    });

    res.json(user);
  } catch (err) {
    console.error(`PUT /api/users/${req.params.id} error:`, err);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
// Elimina un usuario por ID
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Usuario no encontrado' });

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(`DELETE /api/users/${req.params.id} error:`, err);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
