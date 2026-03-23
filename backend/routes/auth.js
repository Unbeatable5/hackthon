const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');

// Citizen
router.post('/citizen/register',    auth.citizenRegister);
router.post('/citizen/verify-otp',  auth.citizenVerifyOTP);
router.post('/citizen/login',       auth.citizenLogin);

// Authority
router.post('/authority/register',  auth.authorityRegister);
router.post('/authority/login',     auth.authorityLogin);

module.exports = router;
