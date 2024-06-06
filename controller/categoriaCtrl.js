const Categoria = require("../models/categoriaModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Método CREAR CATEGORIA
const createCategoria = async (req, res) => {
  req.body.nombre = req.body.nombre.replace(/\s+/g, " ").trim(); 
  req.body.nombre = req.body.nombre.replace(/^\w/, (char) => char.toUpperCase());
  req.body.nombre = req.body.nombre.trim();
  try {
    const existingCategoria = await Categoria.findOne({
      genero: req.body.genero,
      nombre: req.body.nombre
    });
    if (existingCategoria !== null) {
      return res.status(400).json({ message: 'Ya existe una categoría con el mismo género y nombre.' });
    }
    const newCategoria = await Categoria.create(req.body);
    res.json(newCategoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría', error: error.message });
  }
};

// Método EDITAR CATEGORIA
const updateCategoria = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
 if(req.body.nombre){
  req.body.nombre = req.body.nombre.replace(/\s+/g, " ").trim(); 
  req.body.nombre = req.body.nombre.replace(/^\w/, (char) => char.toUpperCase()); 
  req.body.nombre = req.body.nombre.trim();
 }
  try {
    const existingCategoria = await Categoria.findOne({
      _id: { $ne: id },
      genero: req.body.genero,
      nombre: req.body.nombre
    });
    if (existingCategoria !== null) {
      return res.status(400).json({ message: 'Ya existe una categoría con el mismo género y nombre.' });
    }

    const updatedCategoria = await Categoria.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategoria);
  } catch (error) {
    throw new Error(error);
  }
});

// Método ELIMINAR CATEGORIA
const deleteCategoria = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const categoriaEliminada = await Categoria.findByIdAndDelete(id);
    res.json(categoriaEliminada);
  } catch (error) {
    throw new Error(error);
  }
});

// Método OBTENER CATEGORIA POR ID
const getCategoria = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getCategoria = await Categoria.findById(id);
    res.json(getCategoria);
  } catch (error) {
    throw new Error(error);
  }
});

// Método OBTENER TODAS LAS CATEGORIAS
const getallCategoria = asyncHandler(async (req, res) => {
  try {
    const getallCategoria = await Categoria.find();
    res.json(getallCategoria);
  } catch (error) {
    throw new Error(error);
  }
});

// Se exportan los métodos
module.exports = {
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoria,
  getallCategoria,
};
