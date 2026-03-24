require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Habit = require('./models/Habit');
const User = require('./models/User');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error('Error de conexión:', err));

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. Token requerido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido.' });
  }
};

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

/**
 * ENDPOINTS DE HÁBITOS
 */

// Crear hábito
app.post('/habits', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'El nombre del hábito es requerido.' });
    }

    const habit = await Habit.create({
      name: name.trim(),
    });

    return res.status(201).json(habit);
  } catch (error) {
    return res.status(500).json({
      message: 'Error creando hábito',
      error: error.message,
    });
  }
});

// Obtener todos los hábitos
app.get('/habits', verifyToken, async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    return res.json(habits);
  } catch (error) {
    return res.status(500).json({
      message: 'Error obteniendo hábitos',
      error: error.message,
    });
  }
});

// Actualizar nombre del hábito
app.put('/habits/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const update = {};
    if (name !== undefined) update.name = String(name).trim();

    const habit = await Habit.findByIdAndUpdate(id, update, { new: true });

    if (!habit) {
      return res.status(404).json({ message: 'Hábito no encontrado.' });
    }

    return res.json(habit);
  } catch (error) {
    return res.status(500).json({
      message: 'Error actualizando hábito',
      error: error.message,
    });
  }
});

// Marcar hábito como realizado
app.put('/habits/:id/done', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findById(id);

    if (!habit) {
      return res.status(404).json({ message: 'Hábito no encontrado.' });
    }

    const today = new Date();

    if (habit.lastCompletedAt) {
      const lastDate = new Date(habit.lastCompletedAt);

      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);

      const diffTime = today - lastDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 0) {
        return res.json({
          message: 'Este hábito ya fue marcado hoy.',
          habit,
        });
      } else if (diffDays === 1) {
        habit.streak += 1;
      } else {
        habit.streak = 1;
      }
    } else {
      habit.streak = 1;
    }

    habit.lastCompletedAt = new Date();
    await habit.save();

    return res.json({
      message: 'Hábito marcado como realizado.',
      habit,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error marcando hábito como realizado.',
      error: error.message,
    });
  }
});

// Eliminar hábito
app.delete('/habits/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await Habit.findByIdAndDelete(id);

    if (!habit) {
      return res.status(404).json({ message: 'Hábito no encontrado.' });
    }

    return res.json({ message: 'Hábito eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error eliminando hábito',
      error: error.message,
    });
  }
});

/**
 * AUTH
 */

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Usuario creado correctamente.' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error en registro.',
      error: error.message,
    });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'Login exitoso.',
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error en login.',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});