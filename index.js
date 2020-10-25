const express = require("express");
const bodyParser = require("body-parser");
const { request, response } = require("express");
const app = express();

app.get("/", (request, response)=>{
  response.status(200).send("Welcome! to Express API Server");
})







app.listen(3030, () => {
    console.log("Server is listening on port : 3030");
})