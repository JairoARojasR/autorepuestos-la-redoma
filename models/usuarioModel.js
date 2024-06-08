const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bcrypt = require("bcrypt");
const crypto = require("crypto");

var personaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  cedula: {
    type: Number,
    required: true,
    unique: true,
  },
  telefono: {
    type: Number,
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
  fecha_contratacion: {
    type: Date,
  },
  fecha_despido: {
    type: Date,
  },
  motivo: {
    type: String,
  },
  activo: {
    type: Boolean,
    default: true,
  },
  id_rol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rol',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  // permisos:[{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Permiso',
  // }],
},
{
  timestamps: {
    currentTime: function() {
      return moment().tz('America/Bogota').utc(true);
    }
  },
});

// Método para verificar si la contraseña coincide
personaSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.contrasenia);
};

// Método para crear un token de restablecimiento de contraseña
personaSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resettoken;
};


// Exporta el modelo
const Persona = mongoose.model('Persona', personaSchema);

module.exports = Persona;
