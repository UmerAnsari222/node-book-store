const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const indexRoute = require("./routes/index");
const authorsRoute = require("./routes/authors");
const bookRoute = require("./routes/book");
const methodOverride = require("method-override");

require("./db/database");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public/uploads"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.use(express.json());
app.use("/", indexRoute);
app.use("/authors", authorsRoute);
app.use("/book", bookRoute);

app.listen(3000, () => {
  console.log("server listening on port on 3000");
});
