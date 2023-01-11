const express = require("express");
const dotenv = require("dotenv");
const database = require('./dbConnection');
const cors = require("cors");
const userRouter = require('./routers/userRouter')

dotenv.config();
database.connect();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/user',userRouter);


app.listen(process.env.PORT,()=>{
    console.log('app listening at port '+process.env.PORT);
})