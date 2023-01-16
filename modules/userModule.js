const userModel = require("../models/userSchema");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const url = require('url');
const { access } = require("fs");

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
    provider: req.body.provider
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

module.exports.githubRedirect = (req,res) =>{
  const code = req.query.code;
  console.log(code);

  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${process.env.github_client_id}&client_secret=${process.env.github_client_secret}&code=${code}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
    
  }).then((response) => {
    
    const accessToken = response.data.access_token

    // redirect the user to the home page, along with the access token
     res.redirect(`https://roaring-sprinkles-cd0613.netlify.app/auth/login?ghat=${accessToken}`)
  })
};


module.exports.discordRedirect = async (req, res)=>{
  const code = req.query.code;
  if(!code) return res.redirect(`https://roaring-sprinkles-cd0613.netlify.app/auth/login`);
  const redirect = 'https://login-logout-oauth.onrender.com/user/auth/discord/redirect'

   try {
    const formData = new url.URLSearchParams({
      client_id: process.env.discord_client_id,
      client_secret: process.env.discord_client_secret,
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: redirect
    })
    const response = await axios.post('https://discord.com/api/v10/oauth2/token',formData.toString(),{
    headers:{
      'Content-Type' : 'application/x-www-form-urlencoded'
    }
   });
   const {access_token} = response.data;

     res.redirect('https://roaring-sprinkles-cd0613.netlify.app/auth/login?dat='+access_token)
   } catch (error) {
    console.log(error);
   }
}; 