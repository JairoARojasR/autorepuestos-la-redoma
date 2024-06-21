const express = require("express");
const {
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoria,
  getallCategoria,
} = require("../controller/categoriaCtrl");

const {
  authMiddleware,
  isRole,
  isPermiso
} = require("../middleware/authMiddleware"); 

const router = express.Router();
//const { authJwt } = require('../middlewares');
//const { verifyToken, checkPermission } = authJwt;
router.post("/", authMiddleware, isPermiso(["Agregar categorias"]), createCategoria);
router.delete("/:id", authMiddleware, isPermiso(["Eliminar categorias"]), deleteCategoria);
router.get("/:id", getCategoria);
router.put("/:id", updateCategoria, authMiddleware, isPermiso(["Editar categorias", "Inactivar categorias"]));
router.get("/", getallCategoria);


module.exports = router;

// Agregar productos

// Editar productos

// Inactivar productos

// Agregar serviciosmatyrep

// Editar serviciosmatyrep

// Inactivar serviciosmatyrep

// Agregar categorias

// Editar categorias

// Inactivar categorias

// Eliminar categorias

// Agregar marcas de auto

// Editar marcas de auto

// Inactivar marcas de auto

// Eliminar marcas de auto

// Crear venta

// Agregar rol

// Editar rol

// Inactivar rol

// Eliminar rol

// Crear usuarios