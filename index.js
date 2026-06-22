import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middlewares globales de seguridad y parseo
app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 5100;

// Ruta solicitada
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Mensaje en terminal al correr el proyecto en el puerto 5100
app.listen(PORT, () => {
  console.log(`Hello World - Server running on port ${PORT}`);
});