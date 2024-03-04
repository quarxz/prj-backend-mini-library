const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { versionKey: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
