const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { Categories, validate } = require("../models/categories");

router.get("/", async (req, res) => {
  const categories = await Categories.find();
  res.send(categories);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Categories(req.body);

  await category.save();
  return res.send(category);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Categories.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        icon: req.body.icon,
        backgroundColor: req.body.backgroundColor,
        color: req.body.color,
      },
    },
    { new: true, useFindAndModify: false }
  );

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");
  return res.send(category);
});

module.exports = router;
