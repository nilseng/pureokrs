const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const debug = require("debug")("server");
const chalk = require("chalk");
const sslRedirect = require("heroku-ssl-redirect").default;

require("./api/models/db");
require("./api/config/passport");

dotenv.config();

const routesApi = require("./api/routes/index");

const app = express();

app.use(sslRedirect());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(passport.initialize());

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
