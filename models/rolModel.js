const mongoose = require('mongoose');

var rolSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  }
},
{
  timestamps: true,
});

const Rol = mongoose.model('Rol', rolSchema);

module.exports = Rol;
