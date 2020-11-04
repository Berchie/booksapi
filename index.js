const express = require("express");
const bodyParser = require("body-parser");
const booksRouters = require("./controllers/books");
const authorsRouter = require("./controllers/authors");
const books = require("./dataDb/books.json");
const loginRouter = require("./controllers/login");

const app = express();

app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.status(200).send("Welcome! to Books Director API Server");
});

app.use("/admin", loginRouter);

app.use("/books", booksRouters);

app.use("/authors", authorsRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
