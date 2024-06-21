const Permiso = require("../models/permisoModel");

// Método CREAR CATEGORIA
const createPermiso = async (req, res) => {
    const newCategoria = await Permiso.create(req.body);
    res.json(newCategoria);
};


const getallPermiso = async (req, res) => {
    try {
      const getallPermiso = await Permiso.find();
      res.json(getallPermiso);
    } catch (error) {
      throw new Error(error);
    }
  };

module.exports = {
    createPermiso,
    getallPermiso
}