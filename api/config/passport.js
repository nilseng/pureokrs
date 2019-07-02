var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
    },
    (username, password, done) => {
        User.findOne({email: username}, (err, user) => {
            if(err){
                return done(err);}
            //Return if user not found in database
            if(!user){
                return done(null, false, {
                    message: 'User not found'
                });
            }
            //Return if password is wrong
            user.validPassword(password, user, () => {
                    return done(null, false, {
                        message: 'Password validation failed'
                    });
                });
            //If credentials are correct, return the user object
            return done(null, user);
        });
    })
);