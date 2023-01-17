const router = require('express').Router();
const passport = require('passport');
const userModule = require('../modules/userModule');

//different routes for different requests
router.post('/signup',userModule.signUp);
router.post('/login',userModule.logIn);
router.post('/auth/social',userModule.authenticateSocial);
router.get('/auth/github/redirect',userModule.githubRedirect);
router.get('/auth/discord/redirect',userModule.discordRedirect);
router.get('/auth/facebook/redirect',userModule.facebookRedirect);

module.exports = router; 