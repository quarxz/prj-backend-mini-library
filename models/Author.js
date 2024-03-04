const mongoose = require("mongoose");

const { Schema } = mongoose;

const authorSchema = new Schema(
  {
    name: { type: String, required: true },
    book: { type: Schema.Types.ObjectId, ref: "Book" },
  },
  { versionKey: false }
);

const Author = mongoose.models.Author || mongoose.model("Author", authorSchema);

module.exports = Author;
