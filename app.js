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

app.get("/", async (req, res) => {
  await connect();
  const users = await User.find();

  if (!users.length) {
    return res.json({ message: "Users not found" });
  }

  // return res.json(notes.map((note) => ({ ...note._doc, id: note._id })));
  return res.json(users);
});

app.get("/books", async (req, res) => {
  await connect();
  const books = await Book.find().populate("author");
  if (!books.length) {
    return res.json({ message: "Cannot find any books!" });
  }
  return res.json(books);
});

app.get("/authors", async (req, res) => {
  await connect();
  const authors = await Author.find();
  if (!authors.length) {
    return res.json({ message: "Cannot find any authors!" });
  }
  return res.json(authors);
});

app.get("/:author", async (req, res) => {
  await connect();
  const { author } = req.params;

  try {
    const regex = new RegExp(author, "/\bw+\b/ig");

    const { _id: authorId } = (await Author.findOne({
      name: regex,
    })) || { _id: null };
    if (!authorId) {
      return res.status(404).json({ message: "Cannot find this author!" });
    }

    const books = await Book.find({ author: authorId }).populate("author");
    console.log(books);

    console.log(authorId);

    return res.json(books);
  } catch (err) {
    console.log(err);
    return res.status.apply(401).json({ message: "Book does not exists!" });
  }
});

const server = app.listen(port, () => console.log(`Express app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
