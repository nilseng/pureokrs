import passport from "passport";
import mongoose from "mongoose";
const User = mongoose.model("User");
import crypto from "crypto";
import email from "./email.js";
const Okr = mongoose.model("Okr");

const register = (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.company
  ) {
    res.status(400).json({ message: "all fields required" });
  } else {
    let registered = null;
    checkIfCompanyExists(req.body.company, (registered) => {
      if (registered) {
        res.status(400).json({ message: "the company is already registered" });
      } else {
        let user = new User();
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
            const token = user.generateJwt(user);
            res.status(200).json({ token: token });
          }
        });
      }
    });
  }
};

const login = (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    //If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }
    //If a user is found
    if (user) {
      const token = user.generateJwt(user);
      res.status(200).json({ token: token });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};

const addUser = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400).json({ message: "all fields required" });
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
        crypto.pbkdf2(
          user.email,
          user.salt,
          1000,
          64,
          "sha512",
          (err, hash) => {
            if (err) {
              res
                .status(400)
                .json("Could not generate token for email to new user.");
            } else {
              let token = hash.toString("hex");
              email.sendNewUserEmail(user.email, user.company, token);
              res.status(200).json("New user created.");
            }
          }
        );
      }
    });
  }
};

const sendResetEmail = (req, res) => {
  if (!req.body.email) {
    res.status(400).json({ message: "no email received by server" });
  } else {
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if (err || !user) {
        res
          .status(400)
          .json("Could not find a user with email" + req.body.email);
      } else {
        //hashing the email to use as token when resetting password
        crypto.pbkdf2(
          user.email,
          user.salt,
          1000,
          64,
          "sha512",
          (err, hash) => {
            if (err) {
              res.status(400).json("Could not send email to reset password.");
            } else {
              let token = hash.toString("hex");
              email.sendResetEmail(req.body.email, token);
              res
                .status(200)
                .json(
                  "An email was sent with instructions to reset the password."
                );
            }
          }
        );
      }
    });
  }
};

const setNewPassword = (req, res) => {
  if (!req.body.email || !req.body.token || !req.body.password) {
    res.status(400).json({
      message: "email, token or password missing not received by server",
    });
  } else {
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if (err || !user) {
        res
          .status(400)
          .json("Could not find a user with email" + req.body.email);
      } else {
        crypto.pbkdf2(
          user.email,
          user.salt,
          1000,
          64,
          "sha512",
          (err, hash) => {
            if (err) {
              res.status(400).json("Could not reset password");
            } else {
              if (hash.toString("hex") !== req.body.token) {
                res
                  .status(401)
                  .json(
                    "The link used to reset the password is invalid or is already used."
                  );
              } else {
                user.password = req.body.password;

                user.save((err) => {
                  if (err) {
                    res.status(400).json(err);
                  } else {
                    //Generate and return token
                    var token;
                    token = user.generateJwt(user);
                    res.status(200).json({ token: token });
                  }
                });
              }
            }
          }
        );
      }
    });
  }
};

const checkIfCompanyExists = (company, cb) => {
  let registered = null;
  User.find({
    company: company,
  }).exec((err, users) => {
    // In case of error or existing users belonging to a company with the same name, set registered to true
    if (err || users.length > 0) {
      registered = true;
      cb(registered);
    } else {
      // In case okrs belonging to a company with the same name exist, set registered to true
      Okr.find({
        company: company,
      }).exec((err, okrs) => {
        if (err) {
          registered = true;
        } else {
          okrs.length > 0 ? (registered = true) : (registered = false);
        }
        cb(registered);
      });
    }
  });
};

export default {
  register,
  login,
  addUser,
  sendResetEmail,
  setNewPassword,
  checkIfCompanyExists,
};
