import mongoose from "mongoose";
const User = mongoose.model("User");

const companyRead = (req, res) => {
  //If no user ID exists in the JWT, return a 401
  if (!req.payload._id) {
    res.status(401).json({ message: "UnauthorizedError: private company" });
  } else {
    //Otherwise continue
    User.findById(req.payload._id).exec((err, user) => {
      if (err) {
        res.status(401).json("User not found");
      } else {
        res.status(200).json(user);
      }
    });
  }
};

export default { companyRead };
