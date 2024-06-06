const mongoose = require('mongoose');
const moment = require('moment-timezone');

var productoVendidoSchema = new mongoose.Schema({
  id_producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  id_venta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venta',
    required: true,
  },
  precio: {
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
const Producto_Vendido = mongoose.model('Producto_Vendido', productoVendidoSchema);

module.exports = Producto_Vendido;
