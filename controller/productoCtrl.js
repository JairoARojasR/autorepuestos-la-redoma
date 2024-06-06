const Producto = require("../models/productoModel");
const Categoria = require("../models/categoriaModel");
const Marca_auto = require("../models/marca_autoModel");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');


const createProducto = asyncHandler(async (req, res) => {
  req.body.nombre = req.body.nombre.replace(/\s+/g, " ").trim(); // Normaliza espacios y elimina espacios al inicio y al final
  req.body.nombre = req.body.nombre.replace(/^\w/, (char) => char.toUpperCase()); // Capitaliza solo la primera letra de la primera palabra
  req.body.nombre=req.body.nombre.trim();
  try {
    const existingProductWithName = await Producto.findOne({nombre: req.body.nombre});
    if (existingProductWithName) {
      return res.status(400).json({ message: "Error el nombre ya existe" });
    }

    const existingProduct = await Producto.findOne({referencia: req.body.referencia});
    if (existingProduct) {
      return res.status(400).json({ message: "Error la referencia ya existe" });
    }
    const newProduct = await Producto.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const findProduct = await Producto.findById(id);
      res.json(findProduct);
    }
    catch (error) {
      throw new Error(error);
    }
  });

  const getaallProducto = asyncHandler(async (req, res) => {
    try {
      const filters = {};
  
      // Construye los filtros dinámicamente a partir de los parámetros de consulta
      for (const key in req.query) {
        if (req.query.hasOwnProperty(key)) {
          if (mongoose.Types.ObjectId.isValid(req.query[key])) {
            // Si el valor es un ID válido, asigna directamente el valor
            filters[key] = req.query[key];
          } else {
            // De lo contrario, aplica la búsqueda con expresión regular insensible a mayúsculas
            filters[key] = { $regex: req.query[key], $options: 'i' };
          }
        }
      }
  
      const allProduct = await Producto.find(filters);
      res.json(allProduct);
    } catch (error) {
      res.status(500);
      throw new Error(error.message);
    }
  });
  
  const updateProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const { nombre, referencia } = req.body;
      const existingProduct = await Producto.findOne({
        $and: [
          { _id: { $ne: id } }, 
          { $or: [{ nombre }, { referencia }] } 
        ]
      });
  
      if (existingProduct) {
        return res.status(400).json({ error: "El nombre o la referencia ya están en uso por otro producto." });
      }
  
      const updateProduct = await Producto.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
      );
  
      if (!updateProduct) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
  
      res.json(updateProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  const deleteProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const deleteProduct = await Producto.findOneAndDelete({_id: id});
      res.json(deleteProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = { createProducto, getaProducto, getaallProducto, updateProducto, deleteProducto};


