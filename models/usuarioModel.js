const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bcrypt = require("bcrypt");
const crypto = require("crypto"); 

var usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  contrasenia: {
    type: String,
    required: false,
  },
  rol: {
    type: String,
    required: true, 
    default: 'Visitante'
  },
  estado: {
    type: String,
    required: true, 
    default: 'Activo'
  },

  code: {
    type: String,
    required: true, 
  },

  refreshToken: {
    type: String,
  },
  
},
{
  timestamps: {
    currentTime: function() {
      return moment().tz('America/Bogota').utc(true);
    }
  },
});


usuarioSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.contrasenia);
};
usuarioSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resettoken;
};

module.exports = mongoose.model("Usuario", usuarioSchema);
