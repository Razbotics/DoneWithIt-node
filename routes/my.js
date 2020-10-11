const express = require("express");
const router = express.Router();

const { Listing, listingMapper } = require("../models/listing");
const auth = require("../middleware/auth");

router.get("/listings", auth, (req, res) => {
  const listing = Listing.findById(req.user.userId);

  const resources = listing.map(listingMapper);
  res.send(resources);
});

module.exports = router;
