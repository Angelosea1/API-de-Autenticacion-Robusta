/**
 * Middleware: AppToken
 * ─────────────────────────────────────────────────────────────────────────
 * Verifica que la petición incluya el token de aplicación estático definido
 * en la variable de entorno APP_TOKEN.
 *
 * Uso en el header:
 *   app-token: <APP_TOKEN>
 *
 * Errores posibles:
 *   401 – No se proporcionó token
 *   401 – Token inválido
 */
const AppToken = (req, res, next) => {
  const token = req.headers['app-token'];

  // 1. Verificar que el header exista
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. AppToken no proporcionado.' });
  }

  // 2. Comparar contra el token definido en .env
  if (token !== process.env.APP_TOKEN) {
    return res.status(401).json({ error: 'AppToken inválido.' });
  }

  next();
};

export default AppToken;
