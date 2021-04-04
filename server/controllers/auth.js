const AWS = require('aws-sdk');
const EXP_JWT = require('express-jwt');
const JWT = require('jsonwebtoken');
const shortId = require('shortid');
const { registerEmailParams } = require('../helpers/email');
const User = require('../models/user');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const ses = new AWS.SES({apiVersion: '2010-12-01'});

exports.register = (req, res) => {
    const {name, email, password} = req.body;

    // check if user exists
    User.findOne({email}).exec((err, user) => {
        if(user) {
            return res.status(400).json({
                error: 'Email already exists'
            })
        }

        // generate token with username, email & password
        const activationToken = JWT.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: process.env.EXPIRE_IN_ACTIVATION_TOKEN
        });

        const params = registerEmailParams(email, activationToken);

        const sendMail = ses.sendEmail(params).promise();
    
        // Handle promise's fulfilled/rejected states
        sendMail
            .then((data) => {
                console.log(data.MessageId);
                res.json({
                    message: `Email Sent to ${name}, follow the instructions to complete your registration`
                });
            })
            .catch((err) => {
                console.error(err, err.stack);
                res.json({
                    message: `We could not verify your email. Please try later`
                });
            })

    });
}

exports.activateAccount = (req, res) => {
    const { token } = req.body;
    
    // verify token
    JWT.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
        console.log('Token: ', token);
        console.log('Error: ', err);
        if(err) {
            res.status(401).json({
                error: 'Expired link. Try again'
            })
        }

        const {name, email, password} = JWT.decode(token);
        const username = shortId.generate();

        User.findOne({email}).exec((error, user) => {
            if(user) {
                console.log('User Exists');
                return res.status(401).json({
                    error: 'Email is taken'
                })
            }

            // Register new user
            const newUser = new User({username, name, email, password})
            newUser.save((err, result) => {
                if(err) {
                    return res.status(401).json({
                        error: 'Error saving user'
                    })
                }

                return res.json({
                    message: 'Registration successful, Please login'
                })
            })
        })
    })
}

exports.loginAccount = (req, res) => {
    
    // get email & password
    const { email, password } = req.body;

    // find user in DB
    User.findOne({email}).exec((err, user) => {

        if(err || !user) {
            return res.status(400).json({
                error: 'Email or password do not match, please try again'
            })
        }

        // authenticate
        if(!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email or password do not match'
            })
        }

        // generate toke and send to client
        const token = JWT.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.EXPIRE_IN_LOGGED_USER
        })

        const {_id, name, email, role} = user;

        return res.json({
            token,
            user: {_id, name, email, role}
        })
    });
}