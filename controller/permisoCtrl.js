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

  const getPermisoNombreById = async (id) => {
    try {
        const permiso = await Permiso.findById({_id:id});
        return permiso ? permiso.nombre : 'UNKNOWN';
    } catch (error) {
        console.error('Error fetching permission:', error);
        return 'UNKNOWN';
    }
};

module.exports = {
    createPermiso,
    getallPermiso,
    getPermisoNombreById
}