const express = require("express");
const dotenv = require("dotenv");
const database = require('./dbConnection');
const cors = require("cors");
const userRouter = require('./routers/userRouter');
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser')

dotenv.config();
database.connect();

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(cors());

app.use('/user',userRouter);


app.listen(process.env.PORT,()=>{
    console.log('app listening at port '+process.env.PORT);
})