const express = require("express");
const router = express.Router();
const { Expo } = require("expo-server-sdk");

const { User } = require("../models/user");
const { Listing } = require("../models/listing");
const { Messages, validate } = require("../models/messages");
const sendPushNotification = require("../utilities/pushNotifications");
const auth = require("../middleware/auth");

const mapUser = async (userId) => {
  const user = await User.findById(userId);
  return { _id: user._id, name: user.name };
};

const getResources = (messages) => {
  const promises = messages.map(async (msg) => {
    return {
      _id: msg._id,
      listingId: msg.listingId,
      message: msg.message,
      dateTime: msg.dateTime,
      fromUser: await mapUser(msg.fromUserId),
      toUser: await mapUser(msg.toUserId),
    };
  });
  return Promise.all(promises);
};

router.get("/", auth, async (req, res) => {
  const messages = await Messages.find({ toUserId: req.user._id }).select(
    "-__v"
  );
  if (!messages) return res.status(400).send({ error: "Invalid fromUserId." });

  const resources = await getResources(messages);

  res.send(resources);
});

router.delete("/:id", auth, async (req, res) => {
  const message = await Messages.findByIdAndDelete({ _id: req.params.id });
  if (!message) return res.status(400).send({ error: "Invalid message ID." });

  res.send(message);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const listing = await Listing.findById(req.body.listingId);
  if (!listing) return res.status(400).send({ error: "Invalid listingId." });

  const targetUser = await User.findById(listing.userId);
  if (!targetUser) return res.status(400).send({ error: "Invalid userId." });

  const message = new Messages({
    fromUserId: req.user._id,
    toUserId: listing.userId,
    listingId: listing._id,
    message: req.body.message,
    dateTime: Date.now(),
  });

  const { expoPushToken } = targetUser;

  if (Expo.isExpoPushToken(expoPushToken))
    await sendPushNotification(expoPushToken, {
      title: "Message from " + req.user.name,
      body: req.body.message,
    });

  message.save();
  res.status(201).send();
});

module.exports = router;
