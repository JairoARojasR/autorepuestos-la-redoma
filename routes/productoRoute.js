const express = require("express");
const {
  createProducto,
  getaProducto,
  getaallProducto,
  updateProducto,
  deleteProducto,
} = require("../controller/productoCtrl");
const {
  authMiddleware,
  isRole,
  isPermiso
} = require("../middleware/authMiddleware"); 

const router = express.Router();

router.get("/", getaallProducto);
router.post("/", authMiddleware, isPermiso(["Agregar productos"]), createProducto);
router.get("/:id", getaProducto);
router.put("/:id",authMiddleware, isPermiso(["Editar productos","Inactivar productos"]), updateProducto);
router.delete("/:id", deleteProducto);


module.exports = router;


