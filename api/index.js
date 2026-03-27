require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Habit = require('../models/Habit');
const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(
  cors({
    origin: "https://habit-tracker-frontend-olive-delta.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
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
  } catch {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

app.get('/', async (req, res) => {
  await connectDB();
  res.send('API funcionando en Vercel');
});

// AUTH
app.post('/auth/register', async (req, res) => {
  await connectDB();

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Usuario ya existe' });

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ name, email, password: hashedPassword });

  res.json({ message: 'Usuario creado' });
});

app.post('/auth/login', async (req, res) => {
  await connectDB();

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Contraseña incorrecta' });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// HABITS
app.get('/habits', verifyToken, async (req, res) => {
  await connectDB();
  const habits = await Habit.find();
  res.json(habits);
});

app.post('/habits', verifyToken, async (req, res) => {
  await connectDB();
  const habit = await Habit.create(req.body);
  res.json(habit);
});

app.put('/habits/:id/done', verifyToken, async (req, res) => {
  await connectDB();

  const habit = await Habit.findById(req.params.id);

  const today = new Date();

  if (habit.lastCompletedAt) {
    const last = new Date(habit.lastCompletedAt);
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

  habit.lastCompletedAt = today;
  await habit.save();

  res.json({ message: 'Actualizado', habit });
});

module.exports = (req, res) => {
  app(req, res);
};