var fs = require("fs");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = "shhhhhh";
/**logs method and url for each request */
function logger(req, res, next) {
  console.log(req.method, req.url);
  next();
}

function verifyToken(req, res, next) {
  const token = req.cookies.user;
  if (token) {
    // if a user is logged in
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = user;
  }
  next();
}

module.exports = { verifyToken, logger };
