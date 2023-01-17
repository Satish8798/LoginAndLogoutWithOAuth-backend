const express = require("express");
const dotenv = require("dotenv");
const database = require('./dbConnection');
const cors = require("cors");
const userRouter = require('./routers/userRouter');
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser')

dotenv.config(); // configuring the .env file
database.connect(); // connecting to database

const app = express(); // starting the express server

app.use(cookieParser()); // middleware to read cookies

app.use(express.json()); // express middleware to send and recieve data in json
app.use(cors()); //getting requests from client

app.use('/user',userRouter); //routefor user functions

//server listening to port
app.listen(process.env.PORT,()=>{
    console.log('app listening at port '+process.env.PORT);
})