const dotenv = require("dotenv").config(); //s
const express = require("express"); //s
const dbConnect = require("./config/dbConnect"); //s
const app = express(); //s
const { notFound, errorHandler } = require("./middleware/error");
const uploadRouter = require("./routes/uploadRoute");
const marcaautoRouter = require("./routes/marcaautoRoute");
const productoRouter = require("./routes/productoRoute");
const rolRouter = require("./routes/rolRoute");
const permisoRouter = require("./routes/permisoRoute");
const personaRouter = require("./routes/personaRoute");
const serviciosRouter = require("./routes/serviciosmantrepRoute");
const ventaRouter = require("./routes/ventaRoute");
const categoriaRouter=require("./routes/categoriaRoute");
const bodyParser = require("body-parser");
const morgan =require("morgan");
const cookieParser = require("cookie-parser"); 
const cors = require("cors"); 
const PORT = 5000;
dbConnect(); 

app.use(express.static('public'));
app.use(morgan('dev')); 
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
//app.use('/api/color', colorRouter)
app.use(bodyParser.urlencoded({ extended:false})); 
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});  


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://ayrlaredoma.netlify.app');
  // You can also configure other headers as needed
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin','https://ayrlaredoma.netlify.app');
//     //res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');

//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     // Handle preflight requests sino
//     if (req.method === 'OPTIONS') {
//       res.sendStatus(200);
//     } else {
//       next();
//     }
//   });

//app.use('/public/confirm', pruebita)
app.use('/api/categoria', categoriaRouter);
app.use('/api/marca-auto', marcaautoRouter);
app.use('/api/persona', personaRouter);
app.use('/api/producto', productoRouter);
app.use('/api/rol', rolRouter);
app.use('/api/permiso', permisoRouter);
app.use('/api/servicios', serviciosRouter);
app.use('/api/venta', ventaRouter);
//app.use('/api/talla', tallaRouter)

app.use("/api/upload", uploadRouter);
app.use(bodyParser.urlencoded({ extended:false}));

//app.listen(PORT, () => {
//console.log(`Server is running at PORT ${PORT}`);
//app.use('/api/users', userRouter)
//})
