const mongoose = require('mongoose'); 
const moment = require('moment-timezone');

const permisoSchema = new mongoose.Schema({
    nombre:{
      type: String,
      required: true,
      unique:true,
      index: true,
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

module.exports = mongoose.model("Permiso", permisoSchema);
