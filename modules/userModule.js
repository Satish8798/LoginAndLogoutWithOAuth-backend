const userModel = require("../models/userSchema");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//moudle for social login such as google facebook github...
module.exports.authenticateSocial = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return res.status(200).send({
      msg: true,
    });
  }
  userData = new userModel({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    picture: req.body.picture,
  });

  try {
    await userData.save();
    res.status(200).send({
      msg: true,
    });
  } catch (error) {
    res.status(400).send({
      msg: error,
    });
  }
};

module.exports.signUp = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({
      msg: true,
      info: "user already exists"
    });
  }

    //generating the saltstring
    const randomString = await bcrypt.genSalt(10);

    //hashing the password
    const hashedPassword = await bcrypt.hash(req.body.password, randomString);

    //creating a new document in users collection
    const userData = new userModel({ ...req.body, password: hashedPassword,picture:'' });

  //saving the new user data in database
  try {
    await userData.save();
    res.status(200).send({
      msg: true,
    });
  } catch (error) {
    res.status(400).send({
      msg: error,
      info: 'enter valid details'
    });
  }
};

module.exports.logIn = async (req, res) => {
     //Email id check in database
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({
      msg: "email does not exist",
    });
  }
  const userDetails = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    picture:''
  }
  const passwordMatchResponse = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordMatchResponse) {
    return res.status(400).send({
      msg: "invalid password",
    });
  }

  res.status(200).send({
    msg:true,
    userDetails
  })
};
