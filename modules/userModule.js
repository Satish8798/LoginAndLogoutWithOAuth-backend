const userModel = require("../models/userSchema");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const url = require("url");
const { access } = require("fs");

//moudle for google login and saving details
module.exports.authenticateSocial = async (req, res) => {
  //checking if user aready exists
  const user = await userModel.findOne({ email: req.body.email });
  //user exists case
  if (user) {
    return res.status(200).send({
      msg: true,
      user
    });
  }

  //if user not exists creating a new model for user
  userData = new userModel({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    picture: req.body.picture,
    provider: req.body.provider,
  });

  //saving the user
  try {
    const user = await userData.save();
    res.status(200).send({
      msg: true,
      user
    });
  } catch (error) {
    res.status(400).send({
      msg: error,
    });
  }
};

//module for normal signup
module.exports.signUp = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({
      msg: true,
      info: "user already exists",
    });
  }

  //generating the saltstring
  const randomString = await bcrypt.genSalt(10);

  //hashing the password
  const hashedPassword = await bcrypt.hash(req.body.password, randomString);

  //creating a new document in users collection
  const userData = new userModel({
    ...req.body,
    password: hashedPassword,
    picture: "",
  });

  //saving the new user data in database
  try {
    await userData.save();
    res.status(200).send({
      msg: true,
    });
  } catch (error) {
    res.status(400).send({
      msg: error,
      info: "enter valid details",
    });
  }
};

//module for normal login
module.exports.logIn = async (req, res) => {
  //Email id check in database
  const user = await userModel.findOne({ email: req.body.email });

  //if user not exists
  if (!user) {
    return res.status(400).send({
      msg: "email does not exist",
    });
  }

  //if user exists
  const userDetails = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    picture: user.picture,
    _id: user["_id"]
  };

  //comparing the password with hashed password
  const passwordMatchResponse = await bcrypt.compare(
    req.body.password,
    user.password
  );

  // password not matching case
  if (!passwordMatchResponse) {
    return res.status(400).send({
      msg: "invalid password",
    });
  }

  //successful login
  res.status(200).send({
    msg: true,
    userDetails,
  });
};

// github redirect url module
module.exports.githubRedirect = (req, res) => {
  const code = req.query.code;

  //requesting the github api for access token using authorization code
  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${process.env.github_client_id}&client_secret=${process.env.github_client_secret}&code=${code}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    const accessToken = response.data.access_token;

    // redirect the user to the home page, along with the access token
    res.redirect(
      `https://roaring-sprinkles-cd0613.netlify.app/auth/login?ghat=${accessToken}`
    );
  });
};

// discord redirect url module
module.exports.discordRedirect = async (req, res) => {
  const code = req.query.code;
  if (!code)
    return res.redirect(
      `https://roaring-sprinkles-cd0613.netlify.app/auth/login`
    );
  const redirect =
    "https://login-logout-oauth.onrender.com/user/auth/discord/redirect";

  try {
    const formData = new url.URLSearchParams({
      client_id: process.env.discord_client_id,
      client_secret: process.env.discord_client_secret,
      grant_type: "authorization_code",
      code: code.toString(),
      redirect_uri: redirect,
    });

    //requesting the discord api for access token
    const response = await axios.post(
      "https://discord.com/api/v10/oauth2/token",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = response.data;
    
    // redirect the user to the home page, along with the access token
    res.redirect(
      "https://roaring-sprinkles-cd0613.netlify.app/auth/login?dat=" +
        access_token
    );
  } catch (error) {
    console.log(error);
  }
};

//facebook redirect url module
module.exports.facebookRedirect = async (req, res) => {
  try {
    const code = req.query.code;

    //creating the access token url
    const accessTokenUrl = 'https://graph.facebook.com/v15.0/oauth/access_token?' +
      `client_id=${process.env.facebook_client_id}&` +
      `client_secret=${process.env.facebook_client_secret}&` +
      `redirect_uri=${encodeURIComponent('https://login-logout-oauth.onrender.com/user/auth/facebook/redirect')}&` +
      `code=${encodeURIComponent(code)}`;

    const response = await axios.get(accessTokenUrl);

    const { access_token } = response.data;
    
    // redirect the user to the home page, along with the access token
    res.redirect(
      "https://roaring-sprinkles-cd0613.netlify.app/auth/login?fbat=" +
        access_token
    ); 

  } catch (error) {
    console.log(error);
  }
};

module.exports.changeProfilePicture = async (req,res) =>{
  try { 
    const response = await userModel.updateOne({
      email: req.body.email
    },{
      $set: {picture: req.body.picture}
    })
    res.status(200).send(true);
  } catch (error) {
      console.log(error)
  }
}

//module for getting the todolist

module.exports.getTodoList = async (req,res) =>{

  try {
    const user = await userModel.findOne({_id:req.params.id});
    const todos = user.todos
    res.status(200).send({
      msg:true,
      todos
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      error
    })
  }

}

//module for adding a todo to the todolist

module.exports.addTodo = async (req,res) =>{
  try {
    const response = await userModel.updateOne({_id: mongoose.Types.ObjectId(req.body.id)},{
      $push: {todos: req.body.todo}
    })
    const user = await userModel.findOne({_id:  mongoose.Types.ObjectId(req.body.id)});
    const todos = user.todos;
    
    res.status(200).send({
      msg:true,
      todos
    })
  } catch (error) {
    res.status(400).send({
      error
    })
  }

  

}

//module for deleting a todo from the todolist

module.exports.deleteTodo = async (req,res) =>{
  try {
    const response = await userModel.updateOne({_id: req.body.id},{
      $pull: {todos: req.body.todo}
    })

    const user = await userModel.findOne({_id: req.body.id});
    const todos = user.todos;
    res.status(200).send({
      msg:true,
      todos
    })
  } catch (error) {
    res.status(400).send({
      error
    })
  }
}