const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: String,
  exercises: [
    {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
    },
  ],
});

const User = model("User", userSchema);

module.exports = User;
