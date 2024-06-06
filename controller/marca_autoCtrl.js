const Marca_Auto = require("../models/marca_autoModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Método CREAR MARCA
const createMarca_Auto = async (req, res) => {
  req.body.nombre = req.body.nombre.replace(/\s+/g, " ").trim(); // Normaliza espacios y elimina espacios al inicio y al final
  req.body.nombre = req.body.nombre.replace(/^\w/, (char) => char.toUpperCase()); // Capitaliza solo la primera letra de la primera palabra
  req.body.nombre = req.body.nombre.trim();
  try {
    const existingMarca_Auto = await Marca_Auto.findOne({
      nombre: req.body.nombre,
    });

    if (existingMarca_Auto !== null) {
      return res
        .status(400)
        .json({ message: "Ya existe una marca con el mismo nombre." });
    }
    const newMarca_Auto = await Marca_Auto.create(req.body);
    res.json(newMarca_Auto);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la marca", error: error.message });
  }
};

// Método EDITAR MARCA
const updateMarca_Auto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  if (req.body.nombre) {
  req.body.nombre = req.body.nombre.replace(/\s+/g, " ").trim(); 
  req.body.nombre = req.body.nombre.replace(/^\w/, (char) => char.toUpperCase()); 
  req.body.nombre = req.body.nombre.trim();
  }
  try {
    const existingMarca_Auto = await Marca_Auto.findOne({
      _id: { $ne: id },
      nombre: req.body.nombre,
    });
    if (existingMarca_Auto !== null) {
      return res
        .status(400)
        .json({ message: "Ya existe una marca con el mismo nombre." });
    }

    const updatedMarca_Auto = await Marca_Auto.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedMarca_Auto);
  } catch (error) {
    throw new Error(error);
  }
});

// Método ELIMINAR MARCA
const deleteMarca_Auto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const marcaAutoEliminada = await Marca_Auto.findByIdAndDelete(id);
    res.json(marcaAutoEliminada);
  } catch (error) {
    throw new Error(error);
  }
});

// Método OBTENER MARCA POR ID
const getMarca_Auto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getMarca_Auto = await Marca_Auto.findById(id);
    res.json(getMarca_Auto);
  } catch (error) {
    throw new Error(error);
  }
});

// Método OBTENER TODAS LAS MARCAS
const getallMarca_Auto = asyncHandler(async (req, res) => {
  try {
    const getAllMarca_Auto = await Marca_Auto.find();
    res.json(getAllMarca_Auto);
  } catch (error) {
    throw new Error(error);
  }
});

// Se exportan los métodos
module.exports = {
  createMarca_Auto,
  updateMarca_Auto,
  deleteMarca_Auto,
  getMarca_Auto,
  getallMarca_Auto,
};
