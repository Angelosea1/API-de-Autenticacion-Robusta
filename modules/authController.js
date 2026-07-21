import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './user/User.model.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Genera un JWT genérico firmado con JWT_SECRET.
 * @param {object} payload – Datos a incluir en el token (sin contraseña).
 * @returns {string} Token JWT firmado.
 */
const generarToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

// ─── POST /api/v2/auth/register ───────────────────────────────────────────────
export const registerUsuario = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Nombre, correo y password son obligatorios' });
    }

    const usuarioExistente = await User.findOne({ correo });
    if (usuarioExistente) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    // Hash de la contraseña antes de guardar
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await User.create({ nombre, correo, password: passwordHash });

    // Emitir token al registrarse (experiencia de onboarding directa)
    const token = generarToken({
      id: nuevoUsuario._id,
      correo: nuevoUsuario.correo,
      nombre: nuevoUsuario.nombre,
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      usuario: { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, correo: nuevoUsuario.correo },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// ─── POST /api/v2/auth/login ──────────────────────────────────────────────────
export const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: 'Correo y password son obligatorios' });
    }

    // Buscar usuario en MongoDB
    const usuario = await User.findOne({ correo });

    // Respuesta genérica para evitar enumeración de usuarios
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña con bcrypt
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = generarToken({
      id: usuario._id,
      correo: usuario.correo,
      nombre: usuario.nombre,
    });

    res.json({
      status: 'success',
      message: 'Autenticación exitosa',
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el proceso de autenticación' });
  }
};