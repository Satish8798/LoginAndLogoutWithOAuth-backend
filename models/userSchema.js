const mongoose = require("mongoose");
const model= mongoose.model;
const Schema = mongoose.Schema;

//creating schema for user
const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 20,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 20,
    },
    email:{
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        required: true,
        unique: [true, "Email already exists"]
    },
    password:{
        type: String,
        minLength: 6,
    },
    picture:{
        type: String
    }

/*     notes:[mongoose.ObjectId]
 */});

//creating model for mentor schema
userModel = model("users",userSchema);
module.exports = userModel;