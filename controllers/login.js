const loginRouter = require("express").Router();
const users = require("../dataDb/users.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const fs = require("fs");
require("dotenv").config();

loginRouter.post("/signup", (req, res) => {
  let authBody = req.body;

  fs.readFile("./dataDb/users.json", "utf-8", function (err, data) {
    if (err) {
      res.status(400).json({ msg: err.message });
    }

    let newUser = JSON.parse(data);
    console.log(newUser);

    bcrypt.hash(authBody.password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(400).json({ msg: err.message });
      } else {
        newUser.push({
          id: newUser.length + 1,
          name: authBody.name,
          username: authBody.username,
          passwordHash: hash,
          role: "admin",
        });

        fs.writeFile("./dataDb/users.json", JSON.stringify(newUser), "utf-8", function (err) {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "You have successfully signup!!!" });
          }
        });
      }
    });
  });
});

loginRouter.post("/login", (req, res) => {
  const body = req.body;
  const user = users.filter((u) => u.username === body.username);
  const passwordCorrect =
    user === null ? false : bcrypt.compare(body.password, user[0].passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "invaild usersname or password" });
  }

  const userForToken = {
    username: user[0].username,
    id: user[0].id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  res.status(200).json({ token: token, username: user[0].username, name: user[0].name });
});

loginRouter.post("/logout", (req, res) => {
  const jwToken = req.query.auth;

  fs.readFile("./dataDb/blockList.json", "utf-8", function (err, data) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    let userToken = JSON.parse(data);
    userToken.push({ id: userToken.length + 1, token: jwToken });

    fs.writeFile("./dataDb/blockList.json", JSON.stringify(userToken), "utf-8", function (err) {
      if (err) {
        return res.status(401).json({ error: err.message });
      } else {
        return res.status(200).json({ message: "You have logout!!!" });
      }
    });
  });
});
module.exports = loginRouter;
