const express = require("express");
const bodyParser = require("body-parser");
const booksRouters = require("./controllers/books");
const authorsRouter = require("./controllers/authors");
const books = require("./dataDb/books.json");
const loginRouter = require("./controllers/login");

const app = express();

app.use(bodyParser.json());

app.use("/admin", loginRouter);

app.use("/books", booksRouters);

app.use("/authors", authorsRouter);

app.get("/", (request, response) => {
  response.status(200).send("Welcome! to Express API Server");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
