const express = require("express");
const User = require("../models/User");
const Author = require("../models/Author");
const Book = require("../models/Book");

const connect = require("../lib/connect");
const mongoose = require("mongoose");

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

  const regex = new RegExp("\\b" + user + "\\b", "i");

  const {
    _id: userId,
    email,
    password,
    name,
    books,
  } = (await User.findOne({ email: regex })) || {
    _id: null,
    email: null,
    password: null,
    name: null,
    books: null,
  };

  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }

  // return res.json(notes.map((note) => ({ ...note._doc, id: note._id })));
  return res.status(200).json({ id: userId, email, password, name, books });
};

const userBorrowBook = async (req, res) => {
  await connect();
  const { user, id } = req.params;

  const regex = new RegExp("\\b" + user + "\\b", "i");

  if (user) {
    const { _id: userId } = (await User.findOne({ _id: user })) || { _id: null };

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
};

const userGiveBookBack = async (req, res) => {
  await connect();
  const { user, bookid } = req.params;

  const regex = new RegExp("\\b" + user + "\\b", "i");

  if (user) {
    const { _id: userId } = (await User.findOne({ _id: user })) || { _id: null };

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
};

module.exports = {
  getUsers,
  getUser,
  userBorrowBook,
  userGiveBookBack,
};
