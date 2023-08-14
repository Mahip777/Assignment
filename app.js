const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
//const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
//app.use(cookieParser());

const port = 3001;
const uri = process.env.DB;

require('./db/connection')
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))
//app.use(express.urlencoded({extended: false}));
app.use(express.urlencoded({extended: true}));
app.use(require('./router/auth'));
// dotenv.config({path : './config.env' });
// const DB = process.env.DATABASE;


// const middleware = (req, res, next) => {
//   console.log(`hello middleware`)
//   next();
// }



app.get('/', (req, res) => {

    return res.render("homepage")
});

// app.get('/about', middleware, (req, res) => {
//   res.cookie("cookie", "thapa")
//   console.log(`hello about`)
//     res.send(`Hello world about from server`)
// });



app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});