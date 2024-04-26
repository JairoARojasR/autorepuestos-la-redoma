const dotenv = require("dotenv").config(); //s
const express = require("express"); //s
const dbConnect = require("./config/dbConnect"); //s
const app = express(); //s
const { notFound, errorHandler } = require("./middleware/error");

//const userRouter=require("./routes/userRoute");//este
//const productoRouter = require("./routes/productoRoute");
//const pruebita = require("./public/confirm.html");
//const tallaRouter = require("./routes/tallaRoute");
//const uploadRouter = require("./routes/uploadRoute");
//const colorRouter = require("./routes/colorRoute");
//const userRouter=require("./routes/userRoute");
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
//app.use('/public/confirm', pruebita)
//app.use('/api/producto', productoRouter)
//app.use('/api/usuario', userRouter)
//app.use('/api/talla', tallaRouter)
app.use('/api/categoria', categoriaRouter);
//app.use("/api/upload", uploadRouter);
app.use(bodyParser.urlencoded({ extended:false}));

//app.listen(PORT, () => {
//console.log(`Server is running at PORT ${PORT}`);
//app.use('/api/users', userRouter)
//})