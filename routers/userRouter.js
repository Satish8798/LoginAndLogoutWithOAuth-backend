const router = require('express').Router();
const userModule = require('../modules/userModule');

router.post('/signup',userModule.signUp);
router.post('/login',userModule.logIn);
router.post('/auth/social',userModule.authenticateSocial);
router.get('/auth/github/redirect',userModule.githubRedirect)

module.exports = router;