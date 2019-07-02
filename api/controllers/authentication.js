var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');
var email = require('./email.js');

module.exports.register = (req, res) => {  
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
                //Send email to new user
                email.sendEmail(user.email, user.company);

                //Generate and return token
                var token;
                token = user.generateJwt(user);
                res.status(200).json({ 'token': token });
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
    console.log('The server has been asked to add a user');
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
                //Send email to new user
                email.sendNewUserEmail(user.email, user.company);

                res.status(200).json('New user created.');
            }
        });
    }
};