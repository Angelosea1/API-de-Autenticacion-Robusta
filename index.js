import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { loginUsuario, registerUsuario } from './modules/authController.js';
import userRoutes from './modules/user/user.routes.js';
import AppToken from './middlewares/AppToken.js';

dotenv.config();

const app = express();

// ── Helmet: cabeceras de seguridad HTTP ──────────────────────────────────────
app.use(helmet({                           // Activa todas las protecciones por defecto
  contentSecurityPolicy: true,            // Previene XSS e inyección de recursos
  crossOriginEmbedderPolicy: true,        // Aísla el contexto de navegación
  crossOriginOpenerPolicy: true,          // Protege contra ataques Spectre
  crossOriginResourcePolicy: true,        // Controla quién puede cargar recursos
  dnsPrefetchControl: true,              // Evita prefetch DNS no autorizado
  frameguard: { action: 'deny' },        // Bloquea iframes (anti-clickjacking)
  hidePoweredBy: true,                   // Oculta el header X-Powered-By
  hsts: true,                            // Fuerza HTTPS (Strict-Transport-Security)
  ieNoOpen: true,                        // Previene ejecución de descargas en IE
  noSniff: true,                         // Bloquea MIME-type sniffing
  referrerPolicy: true,                  // Controla el header Referrer
  xssFilter: true,                       // Activa el filtro XSS del navegador
}));
app.use(express.json());

// Rutas
app.post('/api/v2/auth/login', AppToken, loginUsuario);
app.post('/api/v2/auth/register', AppToken, registerUsuario);
app.use('/api/v2/users', userRoutes);
app.get('/', (req, res) => res.send('API de Autenticación Robusta'));

const PORT = process.env.PORT || 5100;

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('¡Conectado exitosamente a MongoDB Atlas (Auth Robusta)!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));