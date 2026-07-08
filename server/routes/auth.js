const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'y0uR_SuP3r_s3cR3t_jWt_K3y_2026_SanSah';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Faltan credenciales (correo y password)' });
  }

  try {
    const hasAt = correo.includes('@');
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { correo: { equals: correo, mode: 'insensitive' } },
          { nombre: { equals: correo, mode: 'insensitive' } },
          ...(hasAt ? [] : [{ correo: { startsWith: correo + '@', mode: 'insensitive' } }])
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Sign the JWT
    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error del servidor al intentar iniciar sesión' });
  }
});

// Middleware para verificar JWT
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Token faltante.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, nombre: true, correo: true, rol: true }
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar usuario' });
  }
});

module.exports = { router, requireAuth };
