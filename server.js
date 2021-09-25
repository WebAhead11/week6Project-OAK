var btoa = require("btoa"); // for encrypting data to send from server to user
const bcrypt = require("bcrypt"); // for hashing passwords
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors"); // for heroku
const cookieParser = require("cookie-parser");
const templates = require("./templates.js");
const middlewares = require("./middlewares");
var fs = require("fs");
const server = express();
const db = require("./database/connection");
const ACCESS_TOKEN_SECRET = "shhhhhh";
const PORT = process.env.PORT || 3000;
server.use(cors());
/** Logger */
server.use(middlewares.logger);
server.use(cookieParser());
server.use(express.urlencoded()); // for POST requests
server.use(express.json()); // for POST request in JSON format
server.use(express.static("./public"));
/**Verify token **/
server.use(middlewares.verifyToken);

server.get("/", (req, res) => {
  /** implement req.email */
  const user = req.user;
  if (user) {
    //  const verifiedData = user.user.email;
    const home = templates.home(user.user.email);
    res.send(home);
  } else {
    const home = templates.home();
    res.send(home);
  }
});
server.get("/new-post", (req, res) => {
  const user = req.user;
  if (!user) {
    res.send(
      `
    <h1>user not logged in</h1>
    <a href='/login'>Log in</a>
    `
    );
  } else {
    const post = templates.newPost();
    res.send(post);
  }
});
server.post("/new-post", async (req, res) => {
  const newPost = req.body;
  const user = req.user;
  console.log(newPost);
  console.log("user", user);
  /** get user id */
  const id_query = `SELECT id FROM users WHERE email='${user.user.email}'`;
  const result = await db.query(id_query);
  const user_id = result.rows[0].id;
  console.log("result", result.rows);

  const insertQuery = `INSERT INTO posts (title,text_content,user_id) VALUES($1,$2,$3)`;

  console.log(insertQuery);
  const resu = await db.query(insertQuery, [
    newPost.title,
    newPost.post_content,
    user_id,
  ]);

  res.redirect("/posts");
});
server.get("/posts", async (req, res) => {
  const user = req.user;
  if (!user) {
    res.send(
      `
    <h1>user not logged in</h1>
    <a href='/login'>Log in</a>
    `
    );
  } else {
    /** read post from DB */
    const postsResult = await db.query(
      `SELECT title,text_content,user_id FROM posts`
    );
    console.log("postsResult.rows", postsResult.rows);
    const postsResultRows = postsResult.rows; //[{ "title": "1","text_content": "a",user_id=1}, {"title": "2", "text_content": "b", user_id=2 } ]

    /** get username from DB using user_id */
    const postsResultRowsWithUsernames = await Promise.all(
      postsResultRows.map(async (obj) => {
        const emailQuery = `SELECT email FROM users WHERE id=${obj.user_id}`;
        const emailResult = await db.query(emailQuery);
        console.log("email", emailResult.rows[0].email);
        obj.email = emailResult.rows[0].email;
        return obj;
      })
    );

    console.log("postsResultRowsWithUsernames", postsResultRowsWithUsernames);

    /** convert posts array into a JSON object **/
    const JSONdata = { posts: postsResult.rows }; // { "posts":[{ "title": "1","text_content": "a",user_id=1,email='kassimbashir@gmail.com}, {"title": "2", "text_content": "b", user_id=2,email='kassimnbashir@hotmail.com } ]}
    let stringObj = JSON.stringify(JSONdata); // convert to string in order to encrpyt it
    encodedData = btoa(stringObj); // encrypt posts
    const posts = templates.posts(encodedData);
    res.send(posts);
  }
});
server.get("/signup", (req, res) => {
  const signup = templates.signUp();
  res.send(signup);
});
server.post("/signup", async (req, res) => {
  // async: bcrypt is an async library
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = { email: req.body.email, password: hashedPassword };
    const email = user.email;
    /** read emails from DB */
    const emailObjs = await (await db.query(`SELECT email FROM users`)).rows; // emailsObjs = [ { email: 'kassimbashir@gmail.com' },{ email: 'kassimbashir@hotmail.com' } ]
    /** map the emailObjs into an array of emails */
    const emails = emailObjs.map((obj) => obj.email);
    if (emails.includes(email)) {
      // email already exists!
      const signup = templates.signUp(
        "<h3>email already exists. try again</h3>"
      );
      res.send(signup);
      return;
    }
    /** add new user to db */
    const insertUserQuery = `INSERT INTO users (email,password) VALUES ($1,$2)`;
    db.query(insertUserQuery, [user.email, user.password], (err, result) => {
      if (err) throw err;
    });
    console.log("signed up", email);
    res.send(`
            <h3>Signed up successfully!</h3>
            <a href='/login'>Log in to verify your account</a>
    `);
  } catch (err) {
    console.log(err);
  }
});
server.get("/login", (req, res) => {
  const login = templates.logIn();
  res.send(login);
});

server.post("/login", async (req, res) => {
  // bcrypt is an asnyc library
  const user = { email: req.body.email, password: req.body.password };
  try {
    /** get emails from db */
    const emailResult = await db.query(`SELECT email FROM users`);
    const emailsObjs = emailResult.rows; // emailsObjs = [ { email: 'kassimbashir@gmail.com' },{ email: 'kassimbashir@hotmail.com' } ]
    /** map emailObjs into an array of emails */
    const emails = emailsObjs.map((emailObj) => emailObj.email); // emails = ['kassimbashir@gmail.com','kassimbashir@hotmail.com']
    /** check if user is registered */
    console.log(emails, user.email);
    if (!emails.includes(user.email)) {
      // user is not registered
      console.log("user is not registered");
      const login = templates.logIn(`
        <h1>user is not registered. please sign up first</h1>
        `);
      res.send(login);
    } else {
      console.log("else");
      /** check if username and password match */
      // find password in db
      const passwordResult = await db.query(
        `SELECT password FROM users WHERE email='${user.email}'`
      );

      //  console.log("result", result.rows);
      const passwordInDatabase = passwordResult.rows[0].password;
      const inputPassword = user.password; // plaintext password given by user when trying to log in
      console.log(passwordInDatabase);
      const passwordsMatch = await bcrypt.compare(
        inputPassword,
        passwordInDatabase
      );
      if (!passwordsMatch) {
        // username and password do not match!
        console.log("username and password do not match!");
        const login2 = templates.logIn(`
                      <h1>username and password do not match!</h1>
                      `);
        res.send(login2);
        return;
      }
      const token = jwt.sign({ user: user }, ACCESS_TOKEN_SECRET);
      res.cookie("user", token, { maxAge: 900000 }); // log in user
      console.log(user.email, " logged in");
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

server.get("/logout", (req, res) => {
  const token = req.cookies.user;
  const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
  console.log(user.user.email, " logged out");
  res.clearCookie("user");
  res.redirect("/");
});
/** Else */
server.use((req, res) => {
  res.status(404).send(
    `
      <h1>Invalid URL</h1>
      <a href='/login'>Log in</a>
      `
  );
});

server.listen(PORT, () => {
  console.log(`app is starting on port ${PORT}`);
});
