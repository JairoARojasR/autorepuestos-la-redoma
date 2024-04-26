const User = require("../models/usuarioModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { getTokenData, getToken } = require("../config/jwt.config");

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    console.log("intento de token", req.headers.authorization);
    console.log("intento de token2", res.cookie.refreshToken);
    
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
    
    console.log("header", token);

    if (!token) return res.status(400).json({ message: "No token provided" });

    const decoded = await getTokenData(token);
    const user = await User.findOne(
      { correo: decoded.data.correo },
      { contrasenia: 0 }
    );
   console.log("user de autmiddleware", user)
    if (!user) return res.status(400).json({ message: "No user found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});


const isRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.rol;
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));
  if (hasPermission) {
      next();
    } else {
      return res.status(403).json({ message: "No tienes permisos para acceder a esta ruta." });
    }
  };
};

module.exports = { authMiddleware, isRole };
