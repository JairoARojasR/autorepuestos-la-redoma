const express = require("express");
const {
  createMarca_Auto,
  updateMarca_Auto,
  deleteMarca_Auto,
  getMarca_Auto,
  getallMarca_Auto,
} = require("../controller/marca_autoCtrl");

const {
  authMiddleware,
  isRole,
} = require("../middleware/authMiddleware"); 

const router = express.Router();
//const { authJwt } = require('../middlewares');
//const { verifyToken, checkPermission } = authJwt;
router.post("/", createMarca_Auto);
//router.post("/", authMiddleware, isRole(["Admin" , "Empleado"]), createCategoria);
//router.put("/:id", [authJwt.verifyToken, authJwt.checkPermission('65b93de42d4d1eab56a0825d')], updateCategoria);
router.delete("/:id", deleteMarca_Auto);
router.get("/:id", getMarca_Auto);
router.put("/:id", updateMarca_Auto);
router.get("/", getallMarca_Auto);

// router.delete("/:id",authMiddleware,  isRole(["Admin"]), deleteMarca_Auto);
// router.get("/:id", getMarca_Auto);
// router.put("/:id", authMiddleware,  isRole(["Empleado"]), updateMarca_Auto);
// router.get("/", getallMarca_Auto);

module.exports = router;