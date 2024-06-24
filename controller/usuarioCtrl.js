const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/usuarioModel");
const Rol = require("../models/rolModel");

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
    const { cedula, correo, contrasenia } = req.body;
    const existingUserCedula = await User.findOne({ cedula });
    const existingUserCorreo = await User.findOne({ correo });

    if (existingUserCedula) {
      return res.status(400).json({ message: "El usuario con esta cedula ya existe" });
    }

    if (existingUserCorreo) {
      return res.status(400).json({ message: "El usuario con este correo ya existe" });
    }

    const code = uuidv4();
    const hashedPassword = contrasenia ? await bcrypt.hash(contrasenia, 10) : undefined;

    const newUser = await User.create({
      ...req.body,
      contrasenia: hashedPassword,
      code: code
    });

    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const createProveedor = asyncHandler(async (req, res) => {
  try {
    const {nombre, cedula, correo, telefono, direccion} = req.body;


    const existingVendedorCedula = await User.findOne({cedula});
    const existingVendedorCorreo = await User.findOne({correo});

    if (existingVendedorCedula) {
      return res.status(400).json({ message: "El usuario con esta cedula ya existe" });
    }

    if (existingVendedorCorreo) {
      return res.status(400).json({ message: "El usuario con este correo ya existe" });
    }

    const code = uuidv4();

    const newVendedor = await User.create({
      nombre,
      cedula,
      telefono,
      correo,
      direccion,
      id_rol: "6667c97dbb2265c8a8eba941" , 
      code,
    });

    res.json(newVendedor);

  } catch (error) {
    res.status(500).json({message: error.message})
  }
});



const createEmpleado = asyncHandler(async (req, res) => {
  try {
    let { nombre, cedula, correo, telefono, contrasenia, fecha_contratacion, fecha_despido, motivo, id_rol, permisos } = req.body;

    const existingEmpleadoCedula = await User.findOne({ cedula });
    const existingEmpleadoCorreo = await User.findOne({ correo });

    if (existingEmpleadoCedula) {
      return res.status(400).json({ message: "El usuario con esta cedula ya existe" });
    }

    if (existingEmpleadoCorreo) {
      return res.status(400).json({ message: "El usuario con este correo ya existe" });
    }

    const code = uuidv4();

    if (contrasenia !== undefined) {
      const hashedPassword = await bcrypt.hash(contrasenia, 10);
      contrasenia = hashedPassword;
    }

    const newEmpleado = await User.create({
      nombre,
      cedula,
      correo,
      telefono,
      contrasenia,
      fecha_contratacion,
      fecha_despido,
      motivo,
      id_rol,
      permisos,
      code,
    });

    res.json(newEmpleado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createEmpleado,
};

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

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getUser = await User.findById(id);
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
 console.log("correo", correo);

  // Verificar si el usuario existe
  const findUser = await User.findOne({ correo });

  if (!findUser) {
    return res.status(400).json({ message: "Error usuario no registrado" });
  }
  let code = findUser.code;
  const nombre=findUser.nombre;
  const id= findUser.id;
  console.log("IDDDDDDDDDDDDD", id)
  const refreshToken = generateRefreshToken({ correo, code, nombre, id:id });
  // Verificar las credenciales
  if (contrasenia !== undefined) {
    if (!(findUser && (await findUser.isPasswordMatched(contrasenia)))) {
      return res.status(400).json({ message: "Error constraseña invalida" });
    }
  }
  res.json({
    token: refreshToken,
    estado: findUser.estado,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

const updateUserByEmail = asyncHandler(async (req, res) => {
  const { correobus } = req.params;
  const { cedula, fechaNacimiento, correo, nombre } = req.body; 
  const userData = req.body;
  console.log("req.params:", req.params);
  console.log("req.body:", req.body);

  try {
    // Encuentra al usuario por su correo electrónico
    let user = await User.findOne({ correo: correobus });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verifica que la cédula no se encuentre en otro usuario diferente al mismo
    if (cedula) {
      const userWithSameCedula = await User.findOne({ cedula, correo: { $ne: correobus } });
      if (userWithSameCedula) {
        return res.status(409).json({ message: "La cédula ya está en uso por otro usuario" });
      }
    }

    // Actualiza los datos del usuario encontrado
    user = await User.findOneAndUpdate({ correo: correobus }, userData, { new: true });
    console.log("Usuario actualizado:", user);

    let refreshToken;
    // Si la cédula o la fecha de nacimiento han sido proporcionadas, crear o actualizar el cliente
   
    refreshToken = generateRefreshToken({ correo, code: user.code, nombre, id:user.id});
    const response = { user };
    if (refreshToken) {
      response.token = refreshToken;
    }

    res.json(response);
  } catch (error) {
    console.error("Error al actualizar el usuario o crear el cliente:", error);
    res.status(500).json({ message: "Error al actualizar el usuario o crear el cliente" });
  }
});

const resetPassword = async (req, res) => {
  try {
    // Obtener la data del usuario: correo, nueva contraseña
    req.body.correo = req.body.correo.trim();
    let { correo, nuevaContrasenia } = req.body;

    // Verificar si el usuario existe
    const existingUser = await User.findOne({ correo });
    if (!existingUser) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Encriptar la nueva contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(nuevaContrasenia, 10);
    existingUser.contrasenia = hashedPassword;

    // Guardar el usuario con la nueva contraseña
    await existingUser.save();

    return res
      .status(200)
      .json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Error al resetear la contraseña" });
  }
};

//Se exportan los metodos
module.exports = {
  createUser,
  updateUser,
  updateUserByEmail,
  deleteUser,
  logout,
  loginAdmin,
  getUser,
  getallUser,
  authenticateUser,
  createEmpleado,
  createProveedor,
  resetPassword
};
