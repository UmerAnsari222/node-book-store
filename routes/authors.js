const express = require("express");
const route = express.Router();
const Author = require("../model/author");
const Book = require("../model/book");

route.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    console.log(authors);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

route.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

route.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (error) {
    console.log(error);
    res.render("authors/new", {
      author: author,
      errorMessage: "Author Creating Error",
    });
  }
});

route.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const book = await Book.find({ author: author.id });
    res.render("authors/show", {
      author: author,
      bookByAuthor: book,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
route.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch (error) {
    console.log(error);
    res.redirect("/authors");
  }
});
route.put("/:id", async (req, res) => {
  // const author = new Author({
  //   name: req.body.name,
  // });
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (error) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: "Author Update Error",
      });
    }
  }
});

route.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);

    await author.remove();
    res.redirect("/authors");
  } catch (error) {
    console.log(error);
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});
module.exports = route;
