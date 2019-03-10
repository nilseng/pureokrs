var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = (req, res) => {
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;

    user.setPassword(req.body.password);

    user.save((err)=>{
        //TODO: Add form input and error handling
        var token;
        token = user.generateJwt();
        res.status(200).json({'token': token});
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
            token = user.generateJwt();
            res.status(200).json({'token':token});
        }else{
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);
};