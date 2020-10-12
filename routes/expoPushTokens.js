const express = require("express");
const router = express.Router();
const Joi = require("joi");

const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");

router.post(
  "/",
  [auth, validateWith({ token: Joi.string().required() })],
  async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          expoPushToken: req.body.token,
        },
      },
      { new: true, useFindAndModify: false }
    );
    if (!user) return res.status(400).send({ error: "Invalid user." });

    // console.log("User registered for notifications: ", user);
    res.status(201).send();
  }
);

module.exports = router;
