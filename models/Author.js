const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { versionKey: false }
);

const Author = mongoose.models.Author || mongoose.model("Author", userSchema);

module.exports = Author;
