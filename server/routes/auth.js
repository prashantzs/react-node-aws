const express = require('express');
const router = express.Router();

// import validators
const { userRegisterValidator, userLoginValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

// import from controller
const {register, activateAccount, loginAccount} = require('../controllers/auth');

router.post('/register', userRegisterValidator, runValidation, register);

router.post('/register/activate', activateAccount);

router.post('/login', userLoginValidator, runValidation, loginAccount);

module.exports = router;