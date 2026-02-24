// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Habit = require('./models/Habit');

const app = express();
const PORT = 3000;

app.use(express.json());

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas 🚀'))
  .catch((err) => console.error('Error de conexión:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

/**
 * ENDPOINTS DE HÁBITOS (Semana 1)
 */

// ✅ Alta: crear un hábito
app.post('/habits', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'El nombre del hábito es requerido.' });
    }

    const habit = await Habit.create({ name: name.trim() });
    return res.status(201).json(habit);
  } catch (error) {
    return res.status(500).json({ message: 'Error creando hábito', error: error.message });
  }
});

// ✅ Listar hábitos
app.get('/habits', async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    return res.json(habits);
  } catch (error) {
    return res.status(500).json({ message: 'Error obteniendo hábitos', error: error.message });
  }
});

// ✅ Cambios: actualizar nombre o estado (ej. isActive)
app.put('/habits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const update = {};
    if (name !== undefined) update.name = String(name).trim();
    if (isActive !== undefined) update.isActive = Boolean(isActive);

    const habit = await Habit.findByIdAndUpdate(id, update, { new: true });

    if (!habit) {
      return res.status(404).json({ message: 'Hábito no encontrado.' });
    }

    return res.json(habit);
  } catch (error) {
    return res.status(500).json({ message: 'Error actualizando hábito', error: error.message });
  }
});

// ✅ Baja: eliminar hábito
app.delete('/habits/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await Habit.findByIdAndDelete(id);

    if (!habit) {
      return res.status(404).json({ message: 'Hábito no encontrado.' });
    }

    return res.json({ message: 'Hábito eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error eliminando hábito', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});