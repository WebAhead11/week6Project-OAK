var fs = require("fs");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = "shhhhhh";
/**logs method and url for each request */
function logger(req, res, next) {
  console.log(req.method, req.url);
  next();
}
/** create a users.json file */
function createUsers(req, res, next) {
  if (!fs.existsSync("./database/users.json")) {
    const data = {
      users: [],
    };
    fs.writeFileSync("./database/users.json", JSON.stringify(data)); // create an empty file if doesn't exist
  }
  next();
}
/** create a posts.json file */
function createPosts(req, res, next) {
  if (!fs.existsSync("./database/posts.json")) {
    const data = {
      posts: [],
    };
    fs.writeFileSync("./database/posts.json", JSON.stringify(data)); // create an empty file if doesn't exist
  }
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

module.exports = { verifyToken, createPosts, createUsers, logger };
