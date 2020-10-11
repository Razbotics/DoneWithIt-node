const categories = require("../routes/categories");
const listings = require("../routes/listings");
const users = require("../routes/users");
const auth = require("../routes/auth");
const my = require("../routes/my");
const messages = require("../routes/messages");
const expoPushTokens = require("../routes/expoPushTokens");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use("/api/categories", categories);
  app.use("/api/listings", listings);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/my", my);
  app.use("/api/expoPushTokens", expoPushTokens);
  app.use("/api/messages", messages);
  app.use(error);
};
