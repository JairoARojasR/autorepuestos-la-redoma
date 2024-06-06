const Permiso = require("../models/permisoModel");

// Método CREAR CATEGORIA
const createPermiso = async (req, res) => {
    const newCategoria = await Permiso.create(req.body);
    res.json(newCategoria);
};

module.exports = {
    createPermiso
}