const express = require("express");
const route = express.Router();
const Book = require("../model/book");
const Author = require("../model/author");
// const multer = require("multer");
// const path = require("path");
const imageMineType = ["image/jpeg", "image/png", "image/gif"];

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/uploads");
//   },
//   filename: (req, file, cb) => {
//     // cb(null, file.originalname);
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + "-" + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({ storage: storage });

//*** Get Route For Books
route.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title !== "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore !== "") {
    console.log(req.query.publishedBefore);
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter !== "") {
    query = query.lte("publishDate", req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render("book/index", { books: books, searchOptions: req.query });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//!!!!!!!! New book

route.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// create Book>>>
// route.post("/", upload.single("coverImageName"), async (req, res) => {
//   console.log(req.file.filename);
//   const book = new Book({
//     title: req.body.title,
//     author: req.body.author,
//     publishDate: new Date(req.body.publishDate),
//     pageCount: req.body.pageCount,
//     coverImageName: req.file.filename,
//     description: req.body.description,
//   });
//   try {
//     const newBook = await book.save();
//     res.redirect("book");
//   } catch (error) {
//     console.log(error);
//     renderNewPage(res, book, true);
//   }
// });
route.post("/", async (req, res) => {
  // console.log(req.file.filename);
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });
  saveCover(book, req.body.coverImageName);
  try {
    const newBook = await book.save();
    res.redirect("book");
  } catch (error) {
    console.log(error);
    renderNewPage(res, book, true);
  }
});

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMineType.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, "new", hasError);
}
async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, "edit", hasError);
}
async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = "Error Creating";
    res.render(`book/${form}`, params);
  } catch (error) {
    res.redirect("/book");
  }
}

route.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch {
    res.redirect("/");
  }
});

route.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author").exec();
    res.render("book/show", { book: book });
  } catch {
    res.redirect("/");
  }
});

route.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = new Date(req.body.publishDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;

    if (req.body.book != null && req.body.cover !== null) {
      saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect(`/book/${book.id}`);
  } catch {
    if (book != null) {
      renderEditPage(res, book, true);
    } else {
      res.redirect("/");
    }
  }
});

route.delete("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.remove();
    res.redirect("/book");
  } catch {
    if (book != null) {
      res.render("book/show", {
        book: book,
        errorMessage: "Could Not Remove Book",
      });
    } else {
      res.redirect("/");
    }
  }
});

module.exports = route;
