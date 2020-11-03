const booksRouter = require("express").Router();
const listOfBooks = require("../dataDb/books.json");
const jwt = require("jsonwebtoken");
const users = require("../dataDb/users.json");
const fs = require("fs");
const blockToken = require("../dataDb/blockList.json");

//get token from header of request (i.e. authorization)
const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    return authorization.substring(7);
  }
  return null;
};

const getTokenFromQuery = (jwtoken) => {
  const authorization = jwtoken;
  if (authorization && authorization.toLowerCase()) {
    return authorization;
  }
  return null;
};

booksRouter.get("/", (req, resp) => resp.json(listOfBooks));

booksRouter.get("/:bookId", (req, resp) => {
  let id = req.params.bookId;
  let book = listOfBooks.filter((bk) => bk.id == id);
  resp.status(200).end(resp.json(book));
});

booksRouter.post("/", (req, resp) => {
  const token = getTokenFrom(req);

  if (token === null) {
    return resp.status(400).json({ error: "Authorization token not provided" });
  }

  for (const i in blockToken) {
    if (blockToken[i].token === token) {
      return resp.status(400).json({ message: "Sorry your token had expired after loggin out!!!" });
    }
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken) {
    return resp.status(401).json({ error: "token missing or invalid" });
  }

  const user = users.filter((u) => u.id === decodedToken.id);
  console.log(user);

  fs.readFile("./dataDb/books.json", "utf-8", function (err, data) {
    if (err) {
      return resp.status(400).json({ error: err.message });
    }

    let newBooks = JSON.parse(data);

    if (!req.body.title || !req.body.author) {
      return resp.status(400).json({ msg: "Please provide title and author of the book" });
    }

    newBooks.push({
      title: req.body.title,
      author: req.body.author,
      number_of_pages: req.body.number_of_pages,
      category: req.body.category,
      rating: req.body.rating,
      id: listOfBooks.length + 1,
    });

    fs.writeFile("./dataDb/books.json", JSON.stringify(newBooks), "utf-8", function (err) {
      if (err) {
        return resp.status(401).json({ error: err.message });
      } else {
        return resp.status(200).json({ msg: "Record saved!!!" });
      }
    });
  });

});

booksRouter.delete("/:bookId", (req, resp) => {
  const deleteBookId = req.params.bookId;

  const jwToken = req.query.auth;

  const token = getTokenFromQuery(jwToken);

  if (token === null) {
    return resp.status(400).json({ error: "Authorization token not provided" });
  }

  for (const i in blockToken) {
    if (blockToken[i].token === token) {
      return resp.status(400).json({ message: "Sorry your token had expired after loggin out!!!" });
    }
  }

  blockToken.map((btoken) => {
    if (btoken === token) {
      return resp.status(401).json({ message: "Sorry your token had expired after loggin out!!!" });
    }
  });

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken) {
    return resp.status(401).json({ error: "token missing or invalid" });
  }

  const user = users.filter((u) => u.id === decodedToken.id);
  console.log(user);

  fs.readFile("./dataDb/books.json", "utf-8", function (err, data) {
    if (err) {
      return resp.status(400).json({ error: err.message });
    }

    let rbooks = JSON.parse(data);

    let restOfTheBooks = rbooks.filter((book) => book.id !== parseInt(deleteBookId));
    console.log(restOfTheBooks);

    fs.writeFile("./dataDb/books.json", JSON.stringify(restOfTheBooks), "utf-8", function (err) {
      if (err) {
        return resp.status(401).json({ msg: err.message });
      } else {
        return resp.status(200).json({
          msg: `the book with the id ${deleteBookId} has been deleted!!!`,
        });
      }
    });
  });
});

module.exports = booksRouter;
