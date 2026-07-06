import User from './user/User.model.js';

// POST /api/v2/auth/register — Crear un nuevo usuario
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

    const nuevoUsuario = await User.create({ nombre, correo, password });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario: { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, correo: nuevoUsuario.correo },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// Simulaci�n de base de datos local r�pida en lo que conectas el modelo
const usuariosDB = {
  "usuario@correo.com": {
    password: "PasswordSeguro123!",
    intentosFallidos: 0,
    bloqueadoHasta: null
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const usuario = usuariosDB[correo];
    
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas" }); // Evita enumeraci�n 
    }

    const ahora = new Date();

    if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > ahora) {
      const tiempoRestante = Math.ceil((usuario.bloqueadoHasta - ahora) / (1000 * 60));
      return res.status(403).json({
        error: `Cuenta bloqueada temporalmente. Intente de nuevo en ${tiempoRestante} minutos.`
      });
    }

    if (usuario.password === password) {
      usuario.intentosFallidos = 0;
      usuario.bloqueadoHasta = null;
      return res.json({ status: "success", message: "Autenticacion exitosa" });
    } else {
      usuario.intentosFallidos += 1;

      if (usuario.intentosFallidos >= 3) {
        usuario.bloqueadoHasta = new Date(ahora.getTime() + 15 * 60 * 1000); 
        usuario.intentosFallidos = 0;
        return res.status(403).json({
          error: "Has superado el numero maximo de intentos. Cuenta bloqueada por 15 minutos."
        });
      }

      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error en el proceso de autenticacion" });
  }
};