const mongoose = require('mongoose'); 
const moment = require('moment-timezone');

const notificacionSchema = new mongoose.Schema({
    producto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true,
    },
    mensaje: {
      type: String,
      required: true,
    },

    leida: {
        type: Boolean,
        default: false,
      },
},
    {
        timestamps: {
          currentTime: function() {
            return moment().tz('America/Bogota').utc(true);
          }
        },
    });
  
  const Notificacion = mongoose.model('Notificacion', notificacionSchema);
  
  module.exports = Notificacion;