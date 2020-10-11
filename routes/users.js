const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const { Listing } = require("../models/listing");

router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("Invalid user ID");

  const listings = await Listing.find({ userId: user._id }).countDocuments();

  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    listings: listings,
  });
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  return res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
