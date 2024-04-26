const { default: mongoose } = require("mongoose");

const dbConnect = () => {
    try{
        const conn =mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connect");
    } catch(error){  
        console.log("Database Error: Algo salio mal"); 
    }
   
}
module.exports=dbConnect;