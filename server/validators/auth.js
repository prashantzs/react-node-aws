const {check} = require('express-validator');

exports.userRegisterValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('email')
        .isEmail()
        .withMessage('Must be valid email address'),
    check('password')
        .isLength({min: 8})
        .withMessage('Password must be 8 characters long')
];

exports.userLoginValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be valid email address'),
    check('password')
        .isLength({min: 8})
        .withMessage('Password must be 8 characters long')
];