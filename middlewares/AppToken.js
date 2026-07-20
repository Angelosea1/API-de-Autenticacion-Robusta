/**
 * Middleware: AppToken
 * ─────────────────────────────────────────────────────────────────────────
 * Verifica que la petición incluya el token de aplicación estático definido
 * en la variable de entorno APP_TOKEN.
 *
 * Uso en el header:
 *   Authorization: Bearer <APP_TOKEN>
 *
 * Errores posibles:
 *   401 – No se proporcionó token
 *   401 – Formato incorrecto (falta "Bearer")
 *   401 – Token inválido
 */
const AppToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // 1. Verificar que el header exista
  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado. AppToken no proporcionado.' });
  }

  // 2. Verificar formato "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato inválido. Use: Bearer <AppToken>' });
  }

  const token = parts[1];

  // 3. Comparar contra el token definido en .env
  if (token !== process.env.APP_TOKEN) {
    return res.status(401).json({ error: 'AppToken inválido.' });
  }

  next();
};

export default AppToken;
