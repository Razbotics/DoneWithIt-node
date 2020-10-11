const Joi = require("joi");
const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  icon: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  backgroundColor: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  color: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
});

const Categories = mongoose.model("Categories", categoriesSchema);

function validateCategories(category) {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    icon: Joi.string().min(1).max(50).required(),
    backgroundColor: Joi.string().min(1).max(50).required(),
    color: Joi.string().min(1).max(50).required(),
  };

  return Joi.validate(category, schema);
}

exports.Categories = Categories;
exports.categoriesSchema = categoriesSchema;
exports.validate = validateCategories;
