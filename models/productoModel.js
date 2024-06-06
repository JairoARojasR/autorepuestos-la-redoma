const mongoose = require("mongoose");
const moment = require('moment-timezone');

var productoSchema = new mongoose.Schema(
  {
    nombre: { 
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    referencia:{ 
     type: Number,
     required: true,
     unique: true,
    },

    descripcion: { 
      type: String,
      required: true,
    },

    cantidad_disponible:{ 
      type: Number,
      required: true,
    },

    ubicacion: {
      type: String,
      required: true,
    },

    marca_auto:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marca_auto',
    },],

    categoria:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true,
    },

    proveedores:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Persona',
      required: true,
    },],

    precio: {
      type: Number,
      required: true,
    },

    imagenes: [
        {
          public_id: String,
          url: String,
        },
      ],

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      currentTime: function() {
        return moment().tz('America/Bogota').utc(true);
      }
    },
  });
  
module.exports = mongoose.model("Producto", productoSchema);