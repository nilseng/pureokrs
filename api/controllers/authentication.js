var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');

module.exports.register = (req, res) => {

    if(!req.body.name || !req.body.email || !req.body.password){
        res.status(400).json({"message":"all fields required"});
    }

    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save((err)=>{
        if(err){
            res.status(400).json(err);
        }else{
            var token;
            token = user.generateJwt(user);
            res.status(200).json({'token': token});
        }
    });
};

module.exports.login = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        var token;
        //If Passport throws/catches an error
        if(err){
            res.status(404).json(err);
            return;
        }
        //If a user is found
        if(user){
            token = user.generateJwt(user);
            res.status(200).json({'token':token});
        }else{
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);
};