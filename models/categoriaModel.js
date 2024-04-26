const mongoose = require('mongoose'); 
const moment = require('moment-timezone');


const categoriaSchema = new mongoose.Schema({
    nombre:{
      type: String,
      required: true,
      index: true,
    },

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
  
  
//Export the model

module.exports = mongoose.model("Categoria", categoriaSchema);