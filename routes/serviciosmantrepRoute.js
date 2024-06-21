const express = require("express");
const {
  createServicio,
  updateServicio,
  deleteServicio,
  getServicio,
  getAllServicio,
} = require("../controller/serviciosCtrl");

const {
  authMiddleware,
  isRole,
  isPermiso
} = require("../middleware/authMiddleware"); 

const router = express.Router();

router.post("/", authMiddleware, isPermiso(["Agregar serviciosmatyrep"]) ,createServicio);
router.delete("/:id", authMiddleware, isPermiso(["Eliminar serviciosmatyrep"]) , deleteServicio);
router.get("/:id", getServicio);
router.put("/:id",authMiddleware, isPermiso(["Editar serviciosmatyrep", "Inactivar serviciosmatyrep"]), updateServicio);
router.get("/", getAllServicio);


module.exports = router;