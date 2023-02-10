const router = require('express').Router();
const passport = require('passport');
const userModule = require('../modules/userModule');

//different routes for different requests
router.post('/signup',userModule.signUp);
router.post('/login',userModule.logIn);
router.put('/change-profile-picture',userModule.changeProfilePicture);
router.post('/auth/social',userModule.authenticateSocial);
router.get('/auth/github/redirect',userModule.githubRedirect);
router.get('/auth/discord/redirect',userModule.discordRedirect);
router.get('/auth/facebook/redirect',userModule.facebookRedirect);
router.get('/todo/get-list/:id',userModule.getTodoList)
router.post('/todo/add',userModule.addTodo);
router.put('/todo/delete',userModule.deleteTodo);

module.exports = router; 