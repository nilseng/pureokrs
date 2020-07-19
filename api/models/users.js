const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  company: {
    type: String,
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: String,
  hash: String,
  salt: String,
});

userSchema.methods.setPassword = (user, cb) => {
  crypto.randomBytes(16, (err, salt) => {
    user.salt = salt.toString("hex");
    crypto.pbkdf2(user.password, user.salt, 1000, 64, "sha512", (err, hash) => {
      if (err) {
        user.password = "";
        console.log(err.message);
      }
      user.hash = hash.toString("hex");
      user.password = "";
      cb();
    });
  });
};

userSchema.methods.validPassword = (password, user, cb) => {
  if (user.salt) {
    crypto.pbkdf2(password, user.salt, 1000, 64, "sha512", (err, hash) => {
      if (err) {
        console.log("Could not generate hash for", user.name);
        return;
      } else {
        if (user.hash !== hash.toString("hex")) {
          cb(false);
        } else {
          cb(true);
        }
      }
    });
  }
};

userSchema.methods.generateJwt = (user) => {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: user._id,
      company: encodeURIComponent(user.company),
      email: encodeURIComponent(user.email),
      name: encodeURIComponent(user.name),
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.SECRET_KEY
  );
};

userSchema.pre("save", function (next) {
  this.setPassword(this, () => {
    next();
  });
});

mongoose.model("User", userSchema);
