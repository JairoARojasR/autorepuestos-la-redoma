const express = require('express');
const { getAllNotificaciones, getNotificacionesCount,marcarNotificacionLeida,marcarTodasNotificacionesLeidas } = require('../controller/notificacionesCtrl');

const router = express.Router();

// Ruta para obtener todas las notificaciones
router.get('/', getAllNotificaciones);
router.get('/count', getNotificacionesCount);
router.patch('/:id/leida',marcarNotificacionLeida);
router.patch('/marcar-todas-leidas', marcarTodasNotificacionesLeidas);

module.exports = router;
