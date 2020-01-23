var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');
var email = require('./email.js');
var Okr = mongoose.model('Okr')

module.exports.register = (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.company) {
        res.status(400).json({ "message": "all fields required" });
    } else {
        let registered = null;
        checkIfCompanyExists(req.body.company, (registered) => {
            if (registered) {
                res.status(400).json({ "message": "the company is already registered" });
            } else {
                var user = new User();
                user.company = req.body.company;
                user.name = req.body.name;
                user.email = req.body.email;
                user.password = req.body.password;

                user.save((err) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        //Send email to new user
                        email.sendEmail(user.email, user.company);

                        //Generate and return token
                        var token;
                        token = user.generateJwt(user);
                        res.status(200).json({ 'token': token });
                    }
                });
            }
        });
    }
};

module.exports.login = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        var token;
        //If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }
        //If a user is found
        if (user) {
            token = user.generateJwt(user);
            res.status(200).json({ 'token': token });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);
};

module.exports.addUser = (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        res.status(400).json({ "message": "all fields required" });
    } else {
        var user = new User();
        user.company = req.body.company;
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save((err) => {
            if (err) {
                res.status(400).json(err);
            } else {
                //hashing the email to use as token when resetting password
                crypto.pbkdf2(user.email, user.salt, 1000, 64, 'sha512', (err, hash) => {
                    if (err) {
                        res.status(400).json('Could not generate token for email to new user.');
                    } else {
                        let token = hash.toString('hex');
                        email.sendNewUserEmail(user.email, user.company, token);
                        res.status(200).json('New user created.');
                    }
                });
            }
        });
    }
};

module.exports.sendResetEmail = (req, res) => {
    if (!req.body.email) {
        res.status(400).json({ "message": "no email received by server" });
    } else {
        User.findOne({ email: req.body.email }).exec((err, user) => {
            if (err || !user) {
                res.status(400).json('Could not find a user with email' + req.body.email);
            } else {
                //hashing the email to use as token when resetting password
                crypto.pbkdf2(user.email, user.salt, 1000, 64, 'sha512', (err, hash) => {
                    if (err) {
                        res.status(400).json('Could not send email to reset password.');
                    } else {
                        let token = hash.toString('hex');
                        email.sendResetEmail(req.body.email, token);
                        res.status(200).json('An email was sent with instructions to reset the password.')
                    }
                });
            }
        })
    }
}

module.exports.setNewPassword = (req, res) => {
    if (!req.body.email || !req.body.token || !req.body.password) {
        res.status(400).json({ 'message': 'email, token or password missing not received by server' });
    } else {
        User.findOne({ email: req.body.email }).exec((err, user) => {
            if (err || !user) {
                res.status(400).json('Could not find a user with email' + req.body.email);
            } else {
                crypto.pbkdf2(user.email, user.salt, 1000, 64, 'sha512', (err, hash) => {
                    if (err) {
                        res.status(400).json('Could not reset password');
                    } else {
                        if (hash.toString('hex') !== req.body.token) {
                            res.status(401).json('The link used to reset the password is invalid or is already used.');
                        } else {
                            user.password = req.body.password;

                            user.save((err) => {
                                if (err) {
                                    res.status(400).json(err);
                                } else {
                                    //Generate and return token
                                    var token;
                                    token = user.generateJwt(user);
                                    res.status(200).json({ 'token': token });
                                }
                            });
                        }
                    }
                })
            }
        });
    }
}

checkIfCompanyExists = (company, cb) => {
    let registered = null;
    User.find({
        company: company
    }).exec((err, users) => {
        if (err) {
            registered = true;
            cb(registered);
        } else {
            if (users.length > 0) {
                registered = true;
                cb(registered);
            } else {
                Okr.find({
                    company: company
                }).exec((err, okrs) => {
                    if(err){
                        registered = true
                    }else{
                        if(okrs.length > 0){
                            registered = true
                        }else {
                            registered = false
                        }
                    }
                    cb(registered)
                })
            }
        }
        
    });
}