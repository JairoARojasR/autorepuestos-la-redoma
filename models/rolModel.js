const mongoose = require('mongoose');

var rolSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  activo: {
    type: Boolean,
    default: true,
  }
},
{
  timestamps: true,
});

const Rol = mongoose.model('Rol', rolSchema);

module.exports = Rol;
