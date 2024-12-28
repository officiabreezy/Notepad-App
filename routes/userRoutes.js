const express = require('express');
const {userSignup, userLogin,requestOtp, resetPassword} = require('../controller/userController');

const router = express.Router();


router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/request-otp', requestOtp);
router.post('/reset-password', resetPassword); 

module.exports = router;