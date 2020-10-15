const winston = require("winston");
const path = require("path");
const helmet = require("helmet");
const express = require("express");
const compression = require("compression");
const config = require("config");
const app = express();

app.use(express.static(path.join(config.get("mediaDir"), "media-serve")));
app.use(express.json());
app.use(helmet());
app.use(compression());

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = config.get("port");
const host = config.get("host");

winston.info(`Hosting on ${host}...`);
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
