const express = require("express");
const {
  createRol,
  updateRol,
  deleteRol,
  getRol,
  getAllRol,
} = require("../controller/rolCtrl");

const { 
  authMiddleware,
  isRole,
  isPermiso
} = require("../middleware/authMiddleware"); 

const router = express.Router();
//const { authJwt } = require('../middlewares');
//const { verifyToken, checkPermission } = authJwt;
router.post("/",authMiddleware, isPermiso(["Agregar rol"]),createRol);
//router.post("/", authMiddleware, isRole(["Admin" , "Empleado"]), createCategoria);
//router.put("/:id", [authJwt.verifyToken, authJwt.checkPermission('65b93de42d4d1eab56a0825d')], updateCategoria);
router.delete("/:id",authMiddleware, isPermiso(["Eliminar rol"]), deleteRol);
router.get("/:id", getRol);
router.put("/:id", authMiddleware, isPermiso(["Inactivar rol","Editar rol"]),updateRol);
router.get("/",getAllRol);

// router.delete("/:id",authMiddleware,  isRole(["Admin"]), deleteRol);
// router.get("/:id", getRol);
// router.put("/:id", authMiddleware,  isRole(["Empleado"]), updateRol);
// router.get("/", getallRol);

module.exports = router;