const express = require("express");
const {
  createVenta,
  getVenta,
  getAllVentas,
} = require("../controller/ventaCtrl");

const {
  authMiddleware,
  isRole,
  isPermiso
} = require("../middleware/authMiddleware"); 

const router = express.Router(); 
router.post("/crearVenta",authMiddleware, isPermiso(["Crear venta"]), createVenta);
router.get("/:id", getVenta);
router.get("/", getAllVentas);


module.exports = router;