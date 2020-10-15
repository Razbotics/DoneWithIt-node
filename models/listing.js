const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const config = require("config");

const Location = new mongoose.Schema({
  _id: false,
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

const Listing = mongoose.model(
  "Listing",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    description: {
      type: String,
      trim: true,
      minlength: 0,
      maxlength: 255,
    },
    price: {
      type: Number,
      min: 0,
      max: 10000,
    },
    images: {
      type: Array,
      required: true,
    },
    categoryId: {
      type: mongoose.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.ObjectId,
      required: true,
    },
    location: {
      type: Location,
      required: true,
    },
  })
);

const schema = {
  title: Joi.string().min(5).max(255).required(),
  description: Joi.string().max(255).allow(""),
  price: Joi.number().required().min(1).max(10000),
  categoryId: Joi.objectId().required(),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
};

function validateListing(listing) {
  return Joi.validate(listing, schema);
}

const upload = multer({
  dest: path.join(config.get("mediaDir"), "uploads/"),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const mapper = (listing) => {
  const baseUrl = path.join(config.get("host"), "assets/");

  const mapImage = (image) => ({
    url: `${baseUrl}${image.fileName}_full.jpg`,
    thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`,
  });

  const mappedListing = listing;
  const mappedImages = listing.images.map(mapImage);

  mappedListing.images = mappedImages;

  return mappedListing;
};

exports.Listing = Listing;
exports.validate = validateListing;
exports.schema = schema;
exports.upload = upload;
exports.listingMapper = mapper;
