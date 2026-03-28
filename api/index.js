require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Habit = require('../models/Habit');
const User = require('../models/User');

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin === 'http://localhost:3000' ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error;
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

app.get('/', async (req, res) => {
  try {
    await connectDB();
    res.send('API funcionando en Vercel');
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión con la base de datos' });
  }
});

// AUTH
app.post('/auth/register', async (req, res) => {
  try {
    await connectDB();

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.json({ message: 'Usuario creado' });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ message: 'Error en registro' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error en login' });
  }
});

// HABITS
app.get('/habits', verifyToken, async (req, res) => {
  try {
    await connectDB();
    const habits = await Habit.find();
    return res.json(habits);
  } catch (error) {
    console.error('Error obteniendo hábitos:', error);
    return res.status(500).json({ message: 'Error obteniendo hábitos' });
  }
});

app.post('/habits', verifyToken, async (req, res) => {
  try {
    await connectDB();

    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'El nombre del hábito es requerido' });
    }

    const habit = await Habit.create({
      name: name.trim(),
    });

    return res.json(habit);
  } catch (error) {
    console.error('Error creando hábito:', error);
    return res.status(500).json({ message: 'Error creando hábito' });
  }
});

app.put('/habits/:id/done', verifyToken, async (req, res) => {
  try {
    await connectDB();

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Hábito no encontrado' });
    }

    const today = new Date();

    if (habit.lastCompletedAt) {
      const last = new Date(habit.lastCompletedAt);

      today.setHours(0, 0, 0, 0);
      last.setHours(0, 0, 0, 0);

      const diff = Math.floor((today - last) / (1000 * 60 * 60 * 24));

      if (diff === 0) {
        return res.json({ message: 'Ya marcado hoy', habit });
      } else if (diff === 1) {
        habit.streak += 1;
      } else {
        habit.streak = 1;
      }
    } else {
      habit.streak = 1;
    }

    habit.lastCompletedAt = new Date();
    await habit.save();

    return res.json({ message: 'Actualizado', habit });
  } catch (error) {
    console.error('Error actualizando hábito:', error);
    return res.status(500).json({ message: 'Error actualizando hábito' });
  }
});

module.exports = app;