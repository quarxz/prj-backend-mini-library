const Author = require("../models/Author");
const Book = require("../models/Book");

const connect = require("../lib/connect");

const getAuthors = async (req, res) => {
  await connect();
  const authors = await Author.find();
  if (!authors.length) {
    return res.json({ message: "Could not find any authors!" });
  }
  return res.status(200).json(authors);
};

const getAuthor = async (req, res) => {
  await connect();
  const { author } = req.params;

  try {
    const regex = new RegExp("\\b" + author + "\\b", "i");

    const { _id: authorId } = (await Author.findOne({
      name: regex,
    })) || { _id: null };

    if (!authorId) {
      return res.status(404).json({ message: "Could not find any author!" });
    }

    const books = await Book.find({ author: authorId }).populate("author");

    if (!books) {
      return res.status(404).json({ message: "Could not find any books for this author!" });
    }
    return res.status(200).json(books);
  } catch (err) {
    console.log(err);
    return res.status.apply(404).json({ message: "Author does not exists!" });
  }
};

module.exports = {
  getAuthors,
  getAuthor,
};
