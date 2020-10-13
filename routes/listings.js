const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const config = require("config");
const fs = require("fs");
const imageResize = require("../middleware/imageResize");
const {
  Listing,
  upload,
  listingMapper,
  validate,
} = require("../models/listing");
const { Categories } = require("../models/categories");
const { User } = require("../models/user");

const outputFolder = config.get("mediaDir") + "/media-serve/assets";

const deleteImages = async (images) => {
  const delFull = images.map(async (image) => {
    fs.unlink(outputFolder + "/" + image.fileName + "_full.jpg", () => {})
  });
  const delThumb = images.map(async (image) => {
    fs.unlink(outputFolder + "/" + image.fileName + "_thumb.jpg", () => {})
  });
  return Promise.all([...delFull, ...delThumb]);
}

router.get("/", async (req, res) => {
  const listings = await Listing.find().select("-__v");
  const resources = listings.map(listingMapper);
  res.send(resources);
});

router.get("/:id", auth, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing)
    return res.status(404).send("The listing with the given ID was not found.");
  const resource = listingMapper(listing);
  res.send(resource);
});

router.delete("/:id", auth, async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id).select("-__v");
  if (!listing)
    return res.status(404).send("The listing with the given ID was not found.");
  await deleteImages(listing.images);
  res.send(listing);
});

router.post(
  "/",
  [auth, upload.array("images", config.get("maxImageCount")), imageResize],

  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send("Invalid user ID");

    const category = await Categories.findById(req.body.categoryId);
    if (!category) return res.status(400).send("Invalid category ID");

    const listing = new Listing({
      title: req.body.title,
      price: parseFloat(req.body.price),
      categoryId: req.body.categoryId,
      description: req.body.description,
      images: req.images.map((fileName) => ({ fileName: fileName })),
      userId: user._id,
      location: JSON.parse(req.body.location),
    });

    await listing.save();
    res.send(listing);
  }
);

module.exports = router;
