const Joi = require("joi");
const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.ObjectId,
    required: true,
  },
  listingId: {
    type: mongoose.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
    min: 1,
    max: 500,
  },
  dateTime: {
    type: Date,
    required: true,
  },
});

const Messages = mongoose.model("Messages", messagesSchema);

function validateMessages(message) {
  const schema = {
    listingId: Joi.objectId().required(),
    message: Joi.string().min(1).max(500).required(),
  };

  return Joi.validate(message, schema);
}

exports.Messages = Messages;
exports.validate = validateMessages;
