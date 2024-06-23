const User = require("../models/usuarioModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { getTokenData, getToken } = require("../config/jwt.config");
const {getPermisoNombreById} = require("../controller/permisoCtrl")

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

    if (!token) return res.status(400).json({ message: "No token provided" });

    const decoded = await getTokenData(token);
    const user = await User.findOne(
      { correo: decoded.data.correo },
      { contrasenia: 0 }
    );
    if (!user) return res.status(400).json({ message: "No user found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});


const isRole = (allowedRoles) => {
  return (req, res, next) => {
    console.log("req", req.user);
    const userPermisos = req.user.permisos;
    const hasPermission = allowedRoles.some(role => userPermisos.includes(role));
  if (hasPermission) {
      next();
    } else {
      return res.status(500).json({ message: "ERROR PERMISOS" });
    }
  };
};

const isPermiso = (allowedRoles) => {
  return async (req, res, next) => {

      try {
          const userPermisos = await Promise.all(
              req.user.permisos.map(async (permiso) => await getPermisoNombreById(permiso._id))
          );
          const hasPermission = allowedRoles.some(role => userPermisos.includes(role));

          if (hasPermission) {
              next();
          } else {
              return res.status(403).json({ message: "ERROR PERMISOS" });
          }
      } catch (error) {
          console.error('Error processing permissions:', error);
          return res.status(500).json({ message: "Internal Server Error" });
      }
  };
};



module.exports = { authMiddleware, isRole, isPermiso };
