const express = require("express");
const route = express.Router();
const Book = require("../model/book");

route.get("/", async (req, res) => {
  let books;
  try {
    books = await Book.find().sort({ createdAt: "desc" }).limit(10).exec();
    res.render("index", { books: books });
  } catch (err) {
    console.log(err);
    books = [];
  }
});

module.exports = route;
