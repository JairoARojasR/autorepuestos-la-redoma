const express = require("express");
const {
  createUser,
  createProveedor,
  createEmpleado,
  loginAdmin,
  updateUser,
  logout,
  deleteUser,
  getUser,
  getallUser,
} = require("../controller/usuarioCtrl");
 
const {sendEmailReset} = require("../config/mail.config");
const {getTokenData} = require("../config/jwt.config");

const {
  authMiddleware,
  isRole,
} = require("../middleware/authMiddleware"); 
const router = express.Router();
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser); 
router.post("/login", loginAdmin);
router.put("/:id", updateUser);
router.post("/logout", logout);
router.get("/", getallUser);

//proveedor
router.post("/proveedor", createProveedor)
//empleado
router.post("/empleado", createEmpleado), 


router.get("/getTokenData/:token", async (req, res) => {
  try {
    const token = req.params.token;
    // Verificar si el token está presente
    if (!token) {
      return res.status(400).json({ error: "Token no proporcionado" });
    }

    const decoded = await getTokenData(token);
    res.status(200).json(decoded);
  } catch (error) {
    console.error("Error al decodificar token:", error);
    res.status(500).json({ error: "Error al decodificar token" });
  }
});

router.post("/send_recovery_email",async (req, res) => {
  const { recipient_email, OTP } = req.body;
  sendEmailReset(recipient_email, OTP)
    .then(() => {
      res.status(200).send("Correo electrónico de restablecimiento enviado correctamente.");
    })
    .catch((error) => {
      console.error("Error al enviar el correo electrónico de restablecimiento:", error);
      res.status(500).send("Error al enviar el correo electrónico de restablecimiento.");
    });
});

module.exports = router;