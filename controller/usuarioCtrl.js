const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/usuarioModel");
const {
  getTokenData,
  getToken,
  generateRefreshToken,
} = require("../config/jwt.config");
const {
  getTemplate,
  getTemplate2,
  sendEmail,
} = require("../config/mail.config");
const asyncHandler = require("express-async-handler"); //si
const validateMongoDbId = require("../utils/validateMongodbId");
const validateEmailFormat = require("../utils/validateMongodbEmail");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUser = asyncHandler(async (req, res) => {
  try {
    const existingUserCedula = await User.findOne({ cedula: req.body.cedula });
    const existingUserCorreo = await User.findOne({ correo: req.body.correo });

    if (existingUserCedula) {
      return res
        .status(400)
        .json({ message: "El usuario con esta cedula ya existe" });
    }
    if (existingUserCorreo) {
      return res
        .status(400)
        .json({ message: "El usuario con este correo ya existe" });
    }
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (error) {
    throw new Error(error);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cedula } = req.body;
  validateMongoDbId(id);

  try {
    if (cedula) {
      const existingUser = await User.findOne({ cedula });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: 'La cédula ya está en uso por otro usuario.' });
      }
    }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//Este esta bien
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    throw new Error(error);
  }
});

//Metodo OBTENER USUARIO POR ID
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id);
    const getUser = await User.findById({ id });
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

//Esta bien
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getallUser = await User.find();
    res.json(getallUser);
  } catch (error) {
    throw new Error(error);
  }
});

function validateToken(req, res, next) {
  const accessToken = req.header["authorization"];
  if (!accessToken) res.send("Access Denied");

  jwt.verify(accessToken, config.secretKey, (err, user) => {
    if (err) {
      res.send("Acces Denied, token Expired or incorrect");
    } else {
      next();
    }
  });
}
function generateAccessToken(user) {
  return jwt.sign(user, config.secretKey, { expiresIn: "5m" });
}

//Metodo AUTENTICAR USUARIO
const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const validationResult = validateEmailFormat(email);
    if (validationResult !== undefined) {
      return res.status(400).json({
        msg: "Formato de correo electrónico no válido",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Verifica si user.rol existe y tiene un ID antes de acceder a user.rol
        if (user.rol) {
          const rolPermisos = await RolPermiso.find({
            rol_id: user.rol,
          }).populate("permiso_id");
          const permisos = rolPermisos.map((rp) => rp.permiso_id.nombre);

          const tokenPayload = {
            userId: user._id,
            email: user.email,
            roleId: user.rol, // Cambiar "role" a "roleId" para representar el ID del rol
            permissions: permisos,
          };

          const signedToken = jwt.sign(tokenPayload, config.secretKey, {
            expiresIn: "5m",
          });

          // Establecer el token en el encabezado
          res.header("authorization", signedToken);

          res.json({
            msg: `Rol ID ${user.rol} ACTIVO en el sistema`, // Cambiar el mensaje para mostrar el ID del rol
            success: true,
            token: signedToken,
          });
        } else {
          // Manejar el caso  donde user.rol es null o undefined
          return res.status(404).json({
            msg: "Rol no encontrado para el usuario o ID de rol no presente",
            success: false,
          });
        }
      } else {
        return res.status(401).json({
          msg: "Correo Electrónico o Contraseña no registrados en el sistema ",
          success: false,
        });
      }
    } else {
      return res.status(404).json({
        msg: "Usuario no registrado en el sistema",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Error al autenticar al usuario",
      success: false,
      error: error.message,
    });
  }
};

const loginAdmin = asyncHandler(async (req, res) => {
  const { correo, contrasenia } = req.body;

  // Verificar si el usuario existe
  const findUser = await User.findOne({ correo });
  if (!findUser || (findUser.rol !== "Admin" && findUser.rol !== "Empleado")) {
    throw new Error("No Authorizado");
  }
  console.log("loginAdmin", findUser);
  // Verificar las credenciales
  if (findUser && (await findUser.isPasswordMatched(contrasenia))) {
    // Generar el token de actualización
    let correo = findUser.correo;
    let code = findUser.code;
    const refreshToken = generateRefreshToken({ correo, code });
    console.log("Token de refresh", refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    // Devolver la respuesta con el usuario encontrado
    res.json({
      token: refreshToken,
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

const logout = asyncHandler(async (req, res) => {
  /* const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;*/
  /* const user = await User.findOne({ refreshToken });*/
  /* if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
*/
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

//Se exportan los metodos
module.exports = {
  createUser,
  updateUser,
  deleteUser,
  logout,
  loginAdmin,
  getUser,
  getallUser,
  authenticateUser,
};
