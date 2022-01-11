import express from "express";
const router = express.Router();
import jwt from "express-jwt";
import dotenv from "dotenv";
dotenv.config();

const auth = jwt({
  secret: process.env.SECRET_KEY,
  userProperty: "payload",
  algorithms: ["HS256"],
});

import ctrlCompany from "../controllers/company.js";
import ctrlAuth from "../controllers/authentication.js";
import ctrlOkr from "../controllers/okr.js";
import ctrlUser from "../controllers/user.js";

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

export default router;
