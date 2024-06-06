const express = require("express");
const {
  createProducto,
  getaProducto,
  getaallProducto,
  updateProducto,
  deleteProducto,
  getProductosPorCategoria
} = require("../controller/productoCtrl");
// const {
//   authMiddleware,
//   isRole,
// } = require("../middlewares/authMiddleware"); 

//const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getaallProducto);
router.post("/", createProducto);
router.get("/:id", getaProducto);
router.put("/:id", updateProducto);
router.delete("/:id", deleteProducto);


//router.get("/categoria/:id", getProductosPorCategoria);
// router.get("/color/:id", getProductosPorColor);
// router.get("/talla/:id", getProductosPorTalla);
// router.put("/:id", authMiddleware, isRole(["Admin"]), updateProducto);
// router.delete("/:id", authMiddleware, isRole(["Admin"]), deleteProducto);

module.exports = router;


