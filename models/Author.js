const mongoose = require("mongoose");

const { Schema } = mongoose;

const authorSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { versionKey: false }
);

const Author = mongoose.models.Author || mongoose.model("Author", authorSchema);

module.exports = Author;
