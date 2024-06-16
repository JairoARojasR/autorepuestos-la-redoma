const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Define el esquema para Servicio_Prestado
var servicioPrestadoSchema = new mongoose.Schema({
  id_venta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venta',
    required: true,
  },
  placaCarro: {
    type: Number,
    required: true,
  },
  id_servicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicios_Mant_O_Rep',
    required: true,
  },
  id_mecanico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Persona',
    required: true,
  },
  precio_manoDeObra: {
    type: Number,
    required: true,
  },
},
{
  timestamps: {
    currentTime: function() {
      return moment().tz('America/Bogota').utc(true);
    }
  },
});

// Exporta el modelo
const Servicio_Prestado = mongoose.model('Servicio_Prestado', servicioPrestadoSchema);

module.exports = Servicio_Prestado;
