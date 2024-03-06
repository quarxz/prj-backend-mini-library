const express = require("express");
const User = require("../models/User");
const Author = require("../models/Author");
const Book = require("../models/Book");

const connect = require("../lib/connect");
const mongoose = require("mongoose");

const getBooks = async (req, res) => {
  await connect();
  const books = await Book.find().populate("author");
  if (!books.length) {
    return res.json({ message: "Cannot find any books!" });
  }
  return res.status(200).json(books);
};

const getBook = async (req, res) => {
  await connect();
  const { id } = req.params;

  /**
   * - Wenn kein Book mit id vorhanden
   */
  try {
    const { _id } = (await Book.findOne({ _id: id })) || { _id: null };
    console.log(_id);
  } catch (err) {
    console.error(err);

    return res.status(404).json({ message: "Book does not exits!" });
  }

  const book = await Book.findOne({ _id: id }).populate("author", "name");

  if (!book) {
    return res.status(404).json({ message: "Could not find any book!" });
  }

  return res.status(200).json({ ...book._doc, id: book._id, author: book.author.name });
};

module.exports = {
  getBooks,
  getBook,
};
