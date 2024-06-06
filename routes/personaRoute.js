const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getallUser,
} = require("../controller/usuarioCtrl");

const {
  authMiddleware,
  isRole,
} = require("../middleware/authMiddleware"); 

const router = express.Router();
//const { authJwt } = require('../middlewares');
//const { verifyToken, checkPermission } = authJwt;
router.post("/", createUser);
//router.post("/", authMiddleware, isRole(["Admin" , "Empleado"]), createCategoria);
//router.put("/:id", [authJwt.verifyToken, authJwt.checkPermission('65b93de42d4d1eab56a0825d')], updateCategoria);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.get("/", getallUser);

// router.delete("/:id",authMiddleware,  isRole(["Admin"]), deleteUser);
// router.get("/:id", getUser);
// router.put("/:id", authMiddleware,  isRole(["Empleado"]), updateUser);
// router.get("/", getallUser);
module.exports = router;