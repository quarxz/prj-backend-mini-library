require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3003;
app.use(express.json());
app.use(cors());

const connect = require("./lib/connect");
const { getUsers, getUser } = require("./controllers/userController");
const { getBooks, getBook, userBorrowBook } = require("./controllers/bookController");
const { getAuthors, getAuthor } = require("./controllers/authorController");

const User = require("./models/User");
const Author = require("./models/Author");
const Book = require("./models/Book");

// default catch-all handler
// app.get("*", (request, response) => {
//   response.status(404).json({ message: "Route not defined" });
// });

app.get("/", async (req, res) => {
  await connect();

  // return res.json(notes.map((note) => ({ ...note._doc, id: note._id })));
  return res.status(200).json({ message: "Hallo from mini library!" });
});

// Users
app.get("/users", getUsers);
app.post("/user/:user", getUser);

// Books
app.get("/books", getBooks);
app.get("/book/:id", getBook);
// app.post("/:user/:id/rent", userBorrowBook);

// Authors
app.get("/authors", getAuthors);
app.get("/authors/:author", getAuthor);

/**
 * post -> borrow a book
 */
app.post("/:user/:id/rent", async (req, res) => {
  await connect();
  const { user, id } = req.params;

  const regex = new RegExp("\\b" + user + "\\b", "i");

  if (user) {
    const { _id: userId } = (await User.findOne({ email: user })) || { _id: null };

    if (!userId) {
      return res.status(404).json({ message: "Could not find user!" });
    }

    const book = req.body;

    if (userId && book) {
      const { _id: newUserId } = (await User.findByIdAndUpdate(userId, {
        $push: { books: { book } },
      })) || {
        _id: null,
      };
      return res.status(200).json({ user, id, newUserId });
    } else {
      return res.status(400).json({
        error: "Book NOT added. Book Id and/or User id is missing!",
      });
    }
  }
  res.status(400).json({ message: "Couldn't create new book borrow for user. User is missing!" });
});

/** delete - one specific book from user Books Array  */
app.post("/:user/:bookid/delete", async (req, res) => {
  await connect();
  const { user, bookid } = req.params;

  const regex = new RegExp("\\b" + user + "\\b", "i");

  if (user) {
    const { _id: userId } = (await User.findOne({ email: user })) || { _id: null };

    if (!userId) {
      return res.status(404).json({ message: "Could not find user!" });
    }

    const book = req.body;
    console.log(book);
    if (userId && book) {
      const { _id: newUserId } = (await User.findByIdAndUpdate(userId, {
        $pull: { books: book },
      })) || { _id: null };
      return res.status(200).json({ user, bookid, newUserId });
    } else {
      return res.status(400).json({
        error: "Book NOT deleted. Book Id and/or User id is missing!",
      });
    }
  }
  res.status(400).json({ message: "Couldn't delete book for user. User is missing!" });
});

const server = app.listen(port, () => console.log(`Express app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
