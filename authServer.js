/** this server is for authentication and runs on port 4000 */
const bcrypt = require("bcrypt"); // for hashing passwords
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors"); // for heroku
const cookieParser = require("cookie-parser");
const templates = require("./templates.js");
const server = express();
const ACCESS_TOKEN_SECRET = "shhhhhh";
const PORT = process.env.PORT || 4000;
server.use(cors());
/** Logger */
server.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

server.use(cookieParser());
server.use(express.urlencoded()); // for POST requests
server.use(express.json()); // for POST request in JSON format
server.use(express.static("./public"));

server.get("/", (req, res) => {
  res.redirect("http://localhost:3000/");
});
server.get("/login", (req, res) => {
  res.redirect("http://localhost:3000/login");
});
server.get("/signup", (req, res) => {
  res.redirect("http://localhost:3000/signup");
});
server.get("/logout", (req, res) => {
  res.redirect("http://localhost:3000/logout");
});
server.get("/new-post", (req, res) => {
  res.redirect("http://localhost:3000/new-post");
});
server.get("/posts", (req, res) => {
  res.redirect("http://localhost:3000/posts");
});

server.listen(PORT, () => {
  console.log(`app is starting on port ${PORT}`);
});
