const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/usuarioModel");
const { getTokenData, getToken, generateRefreshToken } = require("../config/jwt.config");
const { getTemplate,getTemplate2, sendEmail } = require("../config/mail.config");
const asyncHandler = require("express-async-handler"); //si
const validateMongoDbId = require("../utils/validateMongodbId");
const validateEmailFormat = require("../utils/validateMongodbEmail");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const createUser = async (req, res) => {
  try {
    // Obtener la data del usuario: nombre, correo
    req.body.correo = req.body.correo.trim();
    let { nombre, correo, contrasenia, estado } = req.body;
    let user = "";
    // Verificar si ya existe un usuario con el mismo correo
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Error usuario ya existe" });
    }
    // Generar el código
    const code = uuidv4();
    // Encriptar la contraseña con bcrypt
    if (contrasenia !== undefined) {
      const hashedPassword = await bcrypt.hash(contrasenia, 10);
      contrasenia = hashedPassword;
      user = new User({
        nombre,
        correo,
        code,
        contrasenia,
      });
    } else {
      user = new User({
        nombre,
        correo,
        code,
        estado,
      });
    }
    let template,mensaje="";
    // Enviar email
    if (contrasenia !== undefined) {
      const token = getToken({ correo, code });
      template = getTemplate(nombre, token);
      mensaje="VERIFICACION EMAIL DE REGISTRO MADAIS";
    } else {
      template = getTemplate2(nombre);
      mensaje= "REGISTRO EXITOSO";
    }

    await sendEmail(
      correo,
      mensaje,
      template
    );
    await user.save();

    return res.status(200).json({ message: "Exito" });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      msg: "Error al registrar usuario",
    });
  }
};

const confirm = async (req, res) => {
  try {
    // obtener el token
    const { token } = req.params;
    console.log(token);
    // verificar la data del token
    const data = await getTokenData(token);
    if (data === null) {
      return res
        .status(400)
        .json({ message: "Error al obtener datos del token" });
    }

    console.log(data);

    const { correo } = data.data;
    // Buscar si existe el usuario
    const user = (await User.findOne({ correo: correo })) || null;

    if (user === null) {
      return res
        .status(400)
        .json({ message: "Error el usuario que intenta verifcarse no existe" });
    }

    // Actualizar usuario
    user.estado = "Verificado";
    await user.save();

    if (user.estado === "Verificado") {
      return res.status(200).json({ message: "Exito" });
    }
  } catch (error) {
    return res.json({
      succes: false,
      msg: "Error al confirmar usuario",
    });
  }
};

//Este esta bien
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
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
    const getUser = await User.findById({id});
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
  if (!findUser || (findUser.rol !== "Admin" && findUser.rol!=="Empleado")) {

    throw new Error("No Authorizado");
  }
  console.log("loginAdmin",findUser);
  // Verificar las credenciales
  if (findUser && (await findUser.isPasswordMatched(contrasenia))) {
    // Generar el token de actualización
    let correo=findUser.correo;
    let code=findUser.code;
    const refreshToken =  generateRefreshToken({correo,code});
    console.log("Token de refresh",refreshToken);
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
  confirm,
  logout,
  loginAdmin,
  getUser,
  getallUser,
  authenticateUser,
};
