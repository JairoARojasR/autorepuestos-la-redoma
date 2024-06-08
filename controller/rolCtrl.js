const Rol = require("../models/rolModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Método CREAR ROL
const createRol = async (req, res) => {
  req.body.nombre = req.body.nombre.replace(/\s+/g, " ").trim(); // Normaliza espacios y elimina espacios al inicio y al final
  req.body.nombre = req.body.nombre.replace(/^\w/, (char) => char.toUpperCase()); // Capitaliza solo la primera letra de la primera palabra
  req.body.nombre = req.body.nombre.trim();
  try {
    const existingRol = await Rol.findOne({
      nombre: req.body.nombre
    });
    if (existingRol !== null) {
      return res.status(400).json({ message: 'Ya existe un rol con el mismo nombre.' });
    }
    const newRol = await Rol.create(req.body);
    res.json(newRol);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el rol', error: error.message });
  }
};

// Método EDITAR ROL
const updateRol = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  req.body.nombre = req.body.nombre.replace(/\s+/g, " ").trim(); 
  req.body.nombre = req.body.nombre.replace(/^\w/, (char) => char.toUpperCase()); 
  req.body.nombre = req.body.nombre.trim();

  try {
    const existingRol = await Rol.findOne({
      _id: { $ne: id },
      nombre: req.body.nombre
    });
    if (existingRol !== null) {
      return res.status(400).json({ message: 'Ya existe un rol con el mismo nombre.' });
    }

    const updatedRol = await Rol.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedRol);
  } catch (error) {
    throw new Error(error);
  }
});

// Método ELIMINAR ROL
const deleteRol = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const rolEliminado = await Rol.findByIdAndDelete(id);
    res.json(rolEliminado);
  } catch (error) {
    throw new Error(error);
  }
});

// Método OBTENER ROL POR ID
const getRol = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getRol = await Rol.findById(id);
    res.json(getRol);
  } catch (error) {
    throw new Error(error);
  }
});

// Método OBTENER TODOS LOS ROLES
const getAllRol = asyncHandler(async (req, res) => {
  try {
    const getAllRol = await Rol.find();
    res.json(getAllRol);
  } catch (error) {
    throw new Error(error);
  }
});

// Se exportan los métodos
module.exports = {
  createRol,
  updateRol,
  deleteRol,
  getRol,
  getAllRol,
};
