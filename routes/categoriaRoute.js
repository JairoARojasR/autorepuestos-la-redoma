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
} = require("../middleware/authMiddleware"); 

const router = express.Router();
//const { authJwt } = require('../middlewares');
//const { verifyToken, checkPermission } = authJwt;
router.post("/",createCategoria);
//router.post("/", authMiddleware, isRole(["Admin" , "Empleado"]), createCategoria);
//router.put("/:id", [authJwt.verifyToken, authJwt.checkPermission('65b93de42d4d1eab56a0825d')], updateCategoria);
router.delete("/:id",authMiddleware,  isRole(["Admin"]), deleteCategoria);
router.get("/:id", getCategoria);
router.put("/:id", authMiddleware,  isRole(["Empleado"]), updateCategoria);
router.get("/", getallCategoria);

module.exports = router;