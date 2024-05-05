require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3003;
app.use(express.json());
app.use(cors());

const connect = require("./lib/connect");
const {
  getUsers,
  getUser,
  userBorrowBook,
  userGiveBookBack,
} = require("./controllers/userController");
const { getBooks, getBook } = require("./controllers/bookController");
const { getAuthors, getAuthor } = require("./controllers/authorController");

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
app.post("/users/:userId/rent", userBorrowBook);
app.post("/users/:userId/delete", userGiveBookBack);

// Authors
app.get("/authors", getAuthors);
app.get("/authors/:author", getAuthor);

const server = app.listen(port, () => console.log(`Express app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
