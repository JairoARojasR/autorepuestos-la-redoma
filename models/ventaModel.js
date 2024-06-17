const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Define el esquema para Venta
var ventaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: function() {
      return moment().tz('America/Bogota').utc(true);
    },
    required: true,
  },
  id_cajera: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Persona',
    required: true,
  },
  id_cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Persona',
  },

  nombre_cliente: {
    type: String,
    required: true,
  },

  cedula_cliente: {
    type: Number,
  },

  correo_cliente: {
    type: String,
    required: true,
  },

telefono_cliente: {
    type: Number,
    required: true,
  },

  total_venta: {
    type: Number,
    required: true,
  },
  metodo_pago: {
    type: String,
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
const Venta = mongoose.model('Venta', ventaSchema);

module.exports = Venta;
