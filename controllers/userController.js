const User = require("../models/User");
const Book = require("../models/Book");

const connect = require("../lib/connect");

/**
 * get all users
 */
const getUsers = async (req, res) => {
  await connect();
  const users = await User.find();

  if (!users.length) {
    return res.status(404).json({ message: "Users not found" });
  }

  // return res.json(notes.map((note) => ({ ...note._doc, id: note._id })));
  return res.status(200).json(users);
};

/**
 * post specified user login
 */
const getUser = async (req, res) => {
  await connect();
  const { user } = req.params;

  const userEmail = user.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);

  console.log(userEmail);

  const {
    _id: userId,
    email,
    password,
    name,
    books,
  } = (await User.findOne(userEmail === null ? { _id: user } : { email: userEmail })) || {
    _id: null,
    email: null,
    password: null,
    name: null,
    books: null,
  };

  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ id: userId, email, password, name, books });
};

const userBorrowBook = async (req, res) => {
  await connect();
  const { userId } = req.params;

  if (userId) {
    const user = (await User.findOne({ _id: userId })) || { _id: null };

    if (!user) {
      return res.status(404).json({ message: "Could not find user!" });
    }

    const { bookId } = req.body;

    if (userId && bookId) {
      // test if book allready exists
      const { _id: isBookExists } = await Book.findOne({ _id: bookId });
      if (user.books.includes(isBookExists)) {
        return res.status(400).json({ message: "Book already rented!" });
      }

      const book = await Book.findOne({ _id: bookId });

      if (book.stock < 1) {
        return res.status(400).json({ message: "Book is out of Stock!" });
      }

      if (book.stock >= 1) {
        const bookStockUpdate = await Book.findByIdAndUpdate(
          { _id: bookId },
          { $inc: { stock: -1 } }
        );
      }

      const updatedUser = (await User.findByIdAndUpdate(userId, {
        $push: { books: bookId },
      })) || {
        _id: null,
      };
      return res.status(200).json({ updatedUser });
    } else {
      return res.status(400).json({
        error: "Book NOT added. Book Id and/or User id is missing!",
      });
    }
  }
  res.status(400).json({ message: "Couldn't create new book borrow for user. User is missing!" });
};

const userGiveBookBack = async (req, res) => {
  await connect();
  const { userId } = req.params;

  if (userId) {
    const user = (await User.findOne({ _id: userId })) || { _id: null };

    if (!user) {
      return res.status(404).json({ message: "Could not find user!" });
    }

    const { bookId } = req.body;

    if (userId && { bookId }) {
      const book = await Book.findOne({ _id: bookId });

      const bookStockUpdate = await Book.findByIdAndUpdate(
        { _id: bookId },
        { $inc: { stock: +1 } }
      );

      const updatedUser = (await User.findByIdAndUpdate(userId, {
        $pull: { books: bookId },
      })) || { _id: null };
      return res.status(200).json({ updatedUser });
    } else {
      return res.status(400).json({
        error: "Book NOT deleted. Book Id and/or User id is missing!",
      });
    }
  }
  res.status(400).json({ message: "Couldn't delete book for user. User is missing!" });
};

module.exports = {
  getUsers,
  getUser,
  userBorrowBook,
  userGiveBookBack,
};
