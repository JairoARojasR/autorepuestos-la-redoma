const Notificacion = require('../models/notificacionModel');
const asyncHandler = require('express-async-handler');

// Método para obtener todas las notificaciones
const getAllNotificaciones = asyncHandler(async (req, res) => {
  try {
    const notificaciones = await Notificacion.find().sort({ createdAt: -1 });
    res.json(notificaciones);
  } catch (error) { 
    res.status(500).json({ message: 'Error al obtener las notificaciones', error: error.message });
  }
});

// Método para obtener el conteo de notificaciones leídas y no leídas
const getNotificacionesCount = asyncHandler(async (req, res) => {
    try {
      const leidas = await Notificacion.countDocuments({ leida: true });
      const noLeidas = await Notificacion.countDocuments({ leida: false });
      res.json({ leidas, noLeidas });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el conteo de notificaciones', error: error.message });
    }
  });
  
  // Método para marcar una notificación como leída
  const marcarNotificacionLeida = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      await Notificacion.findByIdAndUpdate(id, { leida: true });
      res.json({ message: 'Notificación marcada como leída' });
    } catch (error) {
      res.status(500).json({ message: 'Error al marcar la notificación como leída', error: error.message });
    }
  });

  const marcarTodasNotificacionesLeidas = asyncHandler(async (req, res) => {
    try {
      await Notificacion.updateMany({ leida: false }, { leida: true });
      res.json({ message: 'Todas las notificaciones no leídas han sido marcadas como leídas' });
    } catch (error) {
      res.status(500).json({ message: 'Error al marcar todas las notificaciones como leídas', error: error.message });
    }
  });

module.exports = {
  getAllNotificaciones,
  getNotificacionesCount,
  marcarNotificacionLeida,
  marcarTodasNotificacionesLeidas
};
