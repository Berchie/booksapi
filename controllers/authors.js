const authorsRouter = require("express").Router();
const authors = require("../dataDb/authors.json");
const jwt = require("jsonwebtoken");
const users = require("../dataDb/users.json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
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

authorsRouter.get("/authors", (request, response) => {
  response.statusCode = 200;
  response.end(response.json(authors));
});

authorsRouter.get("/:authorsId", (req, res) => {
  let id = req.params.authorsId;
  res.status(200);
  res.end(res.json(authors.find((author) => author.id === parseInt(id))));
});

authorsRouter.get("/:authorsId/books", (req, res) => {
  let id = req.params.authorsId;
  // res.status(200);
  let author = authors.find((author) => author.id === parseInt(id));
  // let authorBooks = books.find((listOfBooks) => books.find(listOfBooks.author === author.name))
  res.status(200).json(author.books);
});

authorsRouter.post("/", (req, res) => {
  const token = getTokenFrom(req);

  if (token === null) {
    return res.status(401).json({ error: "Authorization token not provided" });
  }

  //checking if the token is add to the block list
  for (const i in blockToken) {
    if (blockToken[i].token === token) {
      return resp.status(400).json({ message: "Sorry your token had expired after loggin out!!!" });
    }
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const user = users.filter((u) => u.id === decodedToken.id);
  console.log(user);

  fs.readFile("./dataDb/authors.json", "utf-8", function (err, data) {
    if (err) {
      return resp.status(400).json({ error: err.message });
    }

    let newAuthors = JSON.parse(data);

    if (!req.body.name) {
      return resp.status(400).json({ msg: "Please provide author name!" });
    }

    newAuthors.push({
      name: req.body.name,
      rating: req.body.rate,
      books: req.body.books,
      authorId: uuidv4(),
      id: newAuthors.length + 1,
    });

    // listOfBooks.push(newBooks);

    fs.writeFile("./dataDb/authors.json", JSON.stringify(newAuthors), "utf-8", function (err) {
      if (err) {
        return resp.status(401).json({ error: err.message });
      } else {
        return resp.status(200).status({ msg: "Record saved!!!" });
      }
    });
  });
});

authorsRouter.delete("/:authorId", (req, res) => {
  const deleteAuthorId = req.params.authorId;

  const jwToken = req.query.auth;

  const token = getTokenFromQuery(jwToken);

  if (token === null) {
    return resp.status(400).json({ error: "Authorization token not provided" });
  }

  //checking if the token is add to the block list
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

  fs.readFile("./dataDb/authors.json", "utf-8", function (err, data) {
    if (err) {
      return resp.status(400).json({ error: err.message });
    }

    let rauthors = JSON.parse(data);
    console.log(rauthors);
    console.log(deleteBookId);

    let restOfTheAuthors = rbooks.filter((auhtor) => author.id !== parseInt(deleteAuthorId));
    console.log(restOfTheAuthors);

    fs.writeFile("./dataDb/authors.json", JSON.stringify(restOfTheAuthors), "utf-8", function (
      err
    ) {
      if (err) {
        return resp.status(401).json({ msg: err.message });
      } else {
        return resp.status(200).json({
          msg: `the book with the id ${deleteAuthorId} has been deleted!!!`,
        });
      }
    });
  });
});

module.exports = authorsRouter;
