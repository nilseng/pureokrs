const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const debug = require("debug")("server");
const chalk = require("chalk");

require("./api/models/db");
require("./api/config/passport");

dotenv.config();

const routesApi = require("./api/routes/index");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(passport.initialize());

app.use((req, res, next) => {
  if (
    !req.secure &&
    !req.headers.host === `localhost:${process.env.PORT || 5000}`
  ) {
    return res.redirect("https://" + req.headers.host + req.path);
  }
  next();
});

app.use("/api", routesApi);

//Create link to Angular build directory
const distDir = __dirname + "/dist/";

app.use(express.static(distDir));

const server = app.listen(process.env.PORT || 5000, () => {
  var port = server.address().port;
  debug(`server now running on port ${chalk.green(port)}`);
});

app.use("/*", express.static(distDir));
app.use("*", express.static(distDir));

//Error handlers
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: err.name + ": " + err.message });
  } else {
    res.status(500).json(err);
  }
});
