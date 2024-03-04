const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    year: { type: Number, required: false },
    isbn: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Author" },
  },
  { versionKey: false }
);

const Book = mongoose.models.Book || mongoose.model("Book", userSchema);

module.exports = Book;
