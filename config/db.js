const mongoose = require("mongoose");
const colors = require("colors");
const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log(`Connected to Mongodb Database ${mongoose.connection.host}`.bgMagenta.white)
    } catch (error) {
        console.log(`mongo connect error ${error}`.bgRed.white)
    }
};

module.exports = connectDB;
