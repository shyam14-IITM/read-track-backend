const express = require("express");
const cors = require('cors');
const mongoose= require("mongoose");
const cookieParser = require('cookie-parser')
const app = express();
const authRoutes = require("./routes/authRoutes.js");
const homeRoute = require("./routes/homeRoute.js");
const updateRoute = require("./routes/updateRoutes.js");
require('dotenv').config();
const port = process.env.PORT || 3000


app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set('view engine','ejs');


mongoose.connect(process.env.dbURL)
    .then((res)=>{app.listen(port,()=>console.log('listening at', port))})
    .catch((err)=>{console.log(err)});

// app.get('/',(req,res)=>{res.send('Home Page')})

app.use(authRoutes);
app.use(homeRoute);
app.use(updateRoute);




