var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
const dotenv = require("dotenv");
dotenv.config();

var auth = jwt({
  secret: process.env.SECRET_KEY,
  userProperty: "payload",
});

var ctrlCompany = require("../controllers/company");
var ctrlAuth = require("../controllers/authentication");
var ctrlOkr = require("../controllers/okr");
var ctrlUser = require("../controllers/user");

//Company
router.get("/company", auth, ctrlCompany.companyRead);

//OKRs
router.post("/okr", auth, ctrlOkr.create);
router.get("/okr/:id", auth, ctrlOkr.getById);
router.get("/okr/company/level0", auth, ctrlOkr.getCompanyOkrs);
router.get("/okr/company/all", auth, ctrlOkr.getOkrs);
router.get("/okr/children/:id", auth, ctrlOkr.getChildren);
router.get("/okr/objective/:term", auth, ctrlOkr.getOkrsByObjective);
router.put("/okr/child", auth, ctrlOkr.addChild);
router.put("/okr/removeChild", auth, ctrlOkr.removeChild);
router.delete("/okr/:id", auth, ctrlOkr.deleteOkr);
router.put("/okr", auth, ctrlOkr.updateOkr);

//Users
router.get("/user/:id", auth, ctrlUser.getUser);
router.get("/user/search/:name", auth, ctrlUser.getUsers);
router.get("/user/company/users", auth, ctrlUser.getCompanyUsers);
router.delete("/user/delete/:id", auth, ctrlUser.deleteUser);

//Authentication
router.post("/adduser", auth, ctrlAuth.addUser);
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);
router.post("/sendresetemail", ctrlAuth.sendResetEmail);
router.post("/newpassword", ctrlAuth.setNewPassword);

module.exports = router;
