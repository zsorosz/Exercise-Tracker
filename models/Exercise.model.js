const { Schema, model } = require("mongoose");

const exerciseSchema = new Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
});

const Exercise = model("Exercise", exerciseSchema);

module.exports = Exercise;
