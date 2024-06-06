const Servicios_Mant_O_Rep = require("../models/servicios_mant_o_repModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Método CREAR SERVICIO
const createServicio = async (req, res) => {
  req.body.nombre = req.body.nombre.replace(/\s+/g, " ").trim(); // Normaliza espacios y elimina espacios al inicio y al final
  req.body.nombre = req.body.nombre.replace(/^\w/, (char) => char.toUpperCase()); // Capitaliza solo la primera letra de la primera palabra
  req.body.nombre = req.body.nombre.trim();
  try {
    const existingServicio = await Servicios_Mant_O_Rep.findOne({
      nombre: req.body.nombre
    });
    if (existingServicio !== null) {
      return res.status(400).json({ message: 'Ya existe un servicio con el mismo nombre.' });
    }
    const newServicio = await Servicios_Mant_O_Rep.create(req.body);
    res.json(newServicio);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el servicio', error: error.message });
  }
};

// Método EDITAR SERVICIO
const updateServicio = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  if(req.body.nombre){
    req.body.nombre = req.body.nombre.replace(/\s+/g, " ").trim(); 
    req.body.nombre = req.body.nombre.replace(/^\w/, (char) => char.toUpperCase()); 
    req.body.nombre = req.body.nombre.trim();
  }

  try {
    const existingServicio = await Servicios_Mant_O_Rep.findOne({
      _id: { $ne: id },
      nombre: req.body.nombre
    });
    if (existingServicio !== null) {
      return res.status(400).json({ message: 'Ya existe un servicio con el mismo nombre.' });
    }

    const updatedServicio = await Servicios_Mant_O_Rep.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedServicio);
  } catch (error) {
    throw new Error(error);
  }
});

// Método ELIMINAR SERVICIO
const deleteServicio = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const servicioEliminado = await Servicios_Mant_O_Rep.findByIdAndDelete(id);
    res.json(servicioEliminado);
  } catch (error) {
    throw new Error(error);
  }
});

// Método OBTENER SERVICIO POR ID
const getServicio = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getServicio = await Servicios_Mant_O_Rep.findById(id);
    res.json(getServicio);
  } catch (error) {
    throw new Error(error);
  }
});

// Método OBTENER TODOS LOS SERVICIOS
const getAllServicio = asyncHandler(async (req, res) => {
  try {
    const getAllServicio = await Servicios_Mant_O_Rep.find();
    res.json(getAllServicio);
  } catch (error) {
    throw new Error(error);
  }
});

// Se exportan los métodos
module.exports = {
  createServicio,
  updateServicio,
  deleteServicio,
  getServicio,
  getAllServicio,
};
