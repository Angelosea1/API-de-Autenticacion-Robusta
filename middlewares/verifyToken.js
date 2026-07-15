import jwt from 'jsonwebtoken';

/**
 * Middleware: verifyToken
 * ─────────────────────────────────────────────────────────────────────────
 * Verifica que la petición incluya un JWT válido en el encabezado:
 *   Authorization: Bearer <token>
 *
 * Si el token es válido, adjunta el payload decodificado en `req.usuario`
 * y cede el control al siguiente middleware/controlador.
 *
 * Errores posibles:
 *   401 – No se proporcionó token
 *   401 – Formato incorrecto (falta "Bearer")
 *   401 – Token inválido o expirado
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // 1. Verificar que el header exista
  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  // 2. Verificar formato "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token inválido. Use: Bearer <token>' });
  }

  const token = parts[1];

  // 3. Verificar y decodificar el token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar el payload al objeto request para uso posterior
    req.usuario = payload;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Inicie sesión de nuevo.' });
    }
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

export default verifyToken;
