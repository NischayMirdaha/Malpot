import express from "express"
import connectDB from "./config/mongodb.js"; //import from the mongodb.js 

import userRoutes from "./Routes/userroute.js";
import cors from "cors"

import dotenv from "dotenv"
dotenv.config();


const app=express();
const PORT= process.env.PORT || 3000;

//
app.use(cors())
app.use(express.json());
app.use("/api/users", userRoutes);     
app.use(express.urlencoded());
app.use(express.static("./storage"));

connectDB()//call the function from the mongodb.js

//Routes



app.listen(PORT, ()=>{
    console.log(`Server is running on  the port ${PORT}`)   
})
