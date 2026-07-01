import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { loginUsuario } from './modules/authController.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());

// Rutas
app.post('/api/v2/auth/login', loginUsuario);
app.get('/', (req, res) => res.send('API de Autenticación Robusta'));

const PORT = process.env.PORT || 5100;

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('¡Conectado exitosamente a MongoDB Atlas (Auth Robusta)!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));