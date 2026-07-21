import { Router } from 'express';
import {
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from './user.controller.js';
import AppToken from '../../middlewares/AppToken.js';

const router = Router();

// Todas las rutas de /api/v2/users requieren JWT válido
router.use(AppToken);

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;
