const express = require("express");
const {
  createRol,
  updateRol,
  deleteRol,
  getRol,
  getallRol,
} = require("../controller/rolCtrl");

const {
  authMiddleware,
  isRole,
} = require("../middleware/authMiddleware"); 

const router = express.Router();
//const { authJwt } = require('../middlewares');
//const { verifyToken, checkPermission } = authJwt;
router.post("/",createRol);
//router.post("/", authMiddleware, isRole(["Admin" , "Empleado"]), createCategoria);
//router.put("/:id", [authJwt.verifyToken, authJwt.checkPermission('65b93de42d4d1eab56a0825d')], updateCategoria);
router.delete("/:id",deleteRol);
router.get("/:id", getRol);
router.put("/:id",updateRol);
router.get("/",getallRol);

// router.delete("/:id",authMiddleware,  isRole(["Admin"]), deleteRol);
// router.get("/:id", getRol);
// router.put("/:id", authMiddleware,  isRole(["Empleado"]), updateRol);
// router.get("/", getallRol);

module.exports = router;