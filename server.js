import express, { static as expressStatic } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import { config } from "dotenv";
import _debug from "debug";
const debug = _debug("server");
import chalk from "chalk";
import _sslRedirect from "heroku-ssl-redirect";
const sslRedirect = _sslRedirect.default;
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

import { initDb } from "./api/models/db.js";
import { initPassport } from "./api/config/passport.js";

import routesApi from "./api/routes/index.js";

initDb();
initPassport();

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

app.use(expressStatic(distDir));

const server = app.listen(process.env.PORT || 5000, () => {
  var port = server.address().port;
  debug(`server now running on port ${chalk.green(port)}`);
});

app.use("/*", expressStatic(distDir));
app.use("*", expressStatic(distDir));

//Error handlers
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: err.name + ": " + err.message });
  } else {
    res.status(500).json(err);
  }
});
