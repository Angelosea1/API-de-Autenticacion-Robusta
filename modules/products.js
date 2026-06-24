import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number, // Validación estricta de tipo numérico
    required: true
  },
  ordenacion: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Producto = mongoose.model('Producto', productoSchema);
export default Producto;