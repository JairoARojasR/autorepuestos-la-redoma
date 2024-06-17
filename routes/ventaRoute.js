const express = require("express");
const {
  createVenta,
  getVenta,
  getAllVentas,
} = require("../controller/ventaCtrl");

const {
  authMiddleware,
  isRole,
} = require("../middleware/authMiddleware"); 

const router = express.Router(); 
router.post("/crearVenta", createVenta);
router.get("/:id", getVenta);
router.get("/", getAllVentas);


module.exports = router;