const express = require("express");
const cors = require("cors");
const morgan = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//env config
dotenv.config();

//router import
const urseRoutes = require("./routes/userRoutes")
const blogRoutes = require("./routes/blogRoutes")

//mongodb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"))

//routes
app.use("/api/v1/user", urseRoutes);
app.use("/api/v1/blog", blogRoutes);


//PORT

const PORT = process.env.PORT || 8081;
//listen
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`.bgCyan.white)
})