var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    company: {
        type: String,
        unique: false,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: String,
    hash: String,
    salt: String
});

userSchema.methods.setPassword = (user, cb) => {
    crypto.randomBytes(16, (err, salt) => {
        user.salt = salt.toString('hex');
        crypto.pbkdf2(user.password, user.salt, 1000, 64, 'sha512', (err, hash) => {
            if(err){
                user.password = '';
                console.log(err.message);
            }
            user.hash = hash.toString('hex');
            user.password = '';
            cb();
        });
    });
};

userSchema.methods.validPassword = (password, user, cb) => {
    console.log('Validating password');
    console.log('User salt:', user.salt);
    if(user.salt){
        crypto.pbkdf2(password, user.salt, 1000, 64, 'sha512', (err, hash) => {
            if(err){
                console.log('Could not generate hash for', user.name);
                return;
            }
            if(!user.hash === hash.toString('hex')) cb();
        });
    }
};

userSchema.methods.generateJwt = (user) => {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: user._id,
        company: user.company,
        email: user.email,
        name: user.name,
        exp: parseInt(expiry.getTime()/1000),
    }, process.env.SECRET_KEY);
};

userSchema.pre('save', function(next){
    this.setPassword(this, () => {
        console.log('password', this.password, 'hash', this.hash);
        next();
    });
});

mongoose.model('User', userSchema);