const mongoose = require('mongoose'); 
const moment = require('moment-timezone');


const serviciosSchema = new mongoose.Schema({
    nombre:{
      type: String,
      required: true,
      unique:true,
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

module.exports = mongoose.model("Servicios_Mant_O_Rep", serviciosSchema);