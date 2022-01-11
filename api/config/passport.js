import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";
const User = mongoose.model("User");

export const initPassport = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (username, password, done) => {
        User.findOne({ email: username }, (err, user) => {
          if (err) {
            return done(err);
          }
          //Return if user not found in database
          if (!user) {
            return done(null, false, {
              message: "User not found",
            });
          }
          //Return if password is wrong
          user.validPassword(password, user, (valid) => {
            if (valid) {
              //If credentials are correct, return the user object
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Password validation failed",
              });
            }
          });
        });
      }
    )
  );
};
