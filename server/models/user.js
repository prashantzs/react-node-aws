const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        max: 24,
        unique: true,
        index: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        max: 128,
        unique: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink: {
        data: String,
        default: ''
    }
}, {
    timestamps: true
});

// virtual fields
userSchema.virtual('password')
    .set(function(password) {
        // create temp variable called _password
        this._password = password;

        // generate salt
        this.salt = this.makeSalt();

        // encrypt password
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    })
    
// methods ? authenticate, encryptPassword, makeSalt
userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },
    encryptPassword: function(password) {
        if(!password) return '';

        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch(err){
            return ''
        }
    },
    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
}

// export user model
module.exports = mongoose.model('User', userSchema);