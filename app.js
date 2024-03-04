require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3003;
app.use(express.json());
app.use(cors());

const connect = require("./lib/connect");
const User = require("./models/User");
const Author = require("./models/Author");
const Book = require("./models/Book");

// default catch-all handler
// app.get("*", (request, response) => {
//   response.status(404).json({ message: "Route not defined" });
// });

app.post("/", async (req, res) => {
  await connect();
  const users = await User.find();

  if (!users.length) {
    return res.status(404).json({ message: "Users not found" });
  }

  // return res.json(notes.map((note) => ({ ...note._doc, id: note._id })));
  return res.status(200).json(users);
});

app.get("/books", async (req, res) => {
  await connect();
  const books = await Book.find().populate("author");
  if (!books.length) {
    return res.json({ message: "Cannot find any books!" });
  }
  return res.status(200).json(books);
});

app.get("/authors", async (req, res) => {
  await connect();
  const authors = await Author.find();
  if (!authors.length) {
    return res.json({ message: "Could not find any authors!" });
  }
  return res.status(200).json(authors);
});

app.get("/:author", async (req, res) => {
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
});

app.get("/author/:id", async (req, res) => {
  await connect();
  const { id } = req.params;

  /**
   * - Wenn keine Note mit id vorhanden
   */
  try {
    const { _id } = (await Book.findOne({ _id: id })) || { _id: null };
    console.log(_id);
  } catch (err) {
    console.error(err);

    return res.status(404).json({ message: "Book does not exits!" });
  }

  const {
    _id: bookId,
    title,
    subtitle,
    year,
    isbn,
  } = (await Book.findOne({ _id: id })) || {
    _id: null,
    title: null,
    subtitle: null,
    year: null,
    isbn: null,
  };

  if (!bookId) {
    return res.status(404).json({ message: "Could not find any book!" });
  }

  return res.status(200).json({ id: bookId, title, subtitle, year, isbn });
});

const server = app.listen(port, () => console.log(`Express app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
