const express = require("express");
const jwt = require("jsonwebtoken");
const cors =  require("cors");
const cookieParser = require("cookie-parser");
const templates = require("./templates.js");
var fs = require('fs');
const server = express();
const SECRET = 'shhhhhh';
const PORT = process.env.PORT || 3000; 
server.use(cors());
/** Logger */
server.use((req,res,next)=>{
    console.log(req.method,req.url);
    next();
})
/** create a users.json file */
server.use((req,res,next)=>{

  
  if(!fs.existsSync('./database/users.json')){
    const data = {
      "users":[]
    };
    fs.writeFileSync('./database/users.json', JSON.stringify(data)); // create an empty file if doesn't exist
  }
  next();
})
/** create a posts.json file */
server.use((req,res,next)=>{

  
  if(!fs.existsSync('./database/posts.json')){
    const data = {
      "posts":[]
    };
    fs.writeFileSync('./database/posts.json', JSON.stringify(data)); // create an empty file if doesn't exist
  }
  next();
})
server.use(cookieParser());
server.use(express.urlencoded()); // for POST requests
server.use(express.json()); // for POST request in JSON format
server.use(express.static('./public'));

/**Verify token **/
server.use((req,res,next)=>{
    const token = req.cookies.user;
    console.log("token in server.use:",token);
    if(token){
      const user = jwt.verify(token,SECRET);
      req.user = user;
      console.log("token",token);
      console.log("user",user);
    }
    next();
  });

server.get('/',(req,res)=>{
    /** implement req.email */
    const user = req.user;
    if(user){
      //  const verifiedData = user.user.email;
        const home = templates.home(user.user.email);
        res.send(home);
        
    }else{
        const home = templates.home();  
        res.send(home);
    }
    
    
})
server.get('/new-post',(req,res)=>{
  const user = req.user;
  if(!user){
    res.send(
    `
    <h1>user not logged in</h1>
    <a href='/login'>Log in</a>
    `
    );  
  }else{
    const post = templates.newPost();
    res.send(post);
  }
  
})
server.post('/new-post',(req,res)=>{
   const newPost = req.body;

     /** read posts.json */
  const jsonData = require('./database/posts.json');
  console.log('jsonData',jsonData);
  jsonData.posts.push(newPost);
/** save posts locally on the server */
  fs.writeFile('./database/posts.json', JSON.stringify(jsonData) , function (err) {
    if (err) {
      console.log('There has been an error saving your post data.');
      console.log(err.message);
      return;
    }
    console.log('post data saved successfully.')
  });
   res.redirect('/posts');
})
server.get('/posts',(req,res)=>{
    const user = req.user;
  if(!user){
    res.send(
    `
    <h1>user not logged in</h1>
    <a href='/login'>Log in</a>
    `
    );  
  }else{
    var data = require('./database/posts.json');
    console.log(data);
    res.send(data);    
  }
    
})
server.get('/signup',(req,res)=>{
  const signup = templates.signUp();
  res.send(signup);
})
server.post('/signup',(req,res)=>{
  const user = {email:req.body.email, password:req.body.password};
  const email = user.email;

  /** read users.json */
  const jsonData = require('./database/users.json');
  console.log('jsonData',jsonData);
  //   {
  //     "users":[
  //     {email:"kassimbashir@gmail.com", password:"123"},
  //     {email:"kassimbashir@hotmail.com", password:"1234"}
  //     ]
  // }
  /** check if user already exists */
      /** map the data.users array to include only emails instead of a user obj */
      const emails = jsonData.users.map(userObj => userObj.email);
      if(emails.includes(email)){
        // email already exists!
        const signup = templates.signUp('<h3>email already exists. try again</h3>');
        res.send(signup);
        return;
      }
  jsonData.users.push(user);
/** save usernames locally on the server */
  fs.writeFile('./database/users.json', JSON.stringify(jsonData) , function (err) {
    if (err) {
      console.log('There has been an error saving your user data.');
      console.log(err.message);
      return;
    }
    console.log('user data saved successfully.')
  });
  
    console.log("signed up",usernames);
  
    res.send(`
            <h3>Signed up successfully!</h3>
            <a href='/login'>Log in to verify your account</a>
    `)
})
server.get('/login',(req,res)=>{
    const login = templates.logIn();
    res.send(login);
})
// TOKEN FORMAT: authorization: Bearer <access_token>
server.post('/login',(req,res)=>{

    const user = {email:req.body.email, password:req.body.password};
    console.log("user", user);
    const email = user.email;
  
    try{
      var data = require('./database/users.json');
       
    }catch(err){
      console.log(err);
    }
   console.log("data",data);
 //   {
  //     "users":[
  //     {email:"kassimbashir@gmail.com", password:"123"},
  //     {email:"kassimbashir@hotmail.com", password:"1234"}
  //     ]
  // }
  /** map the data.users array to include only emails instead of a user obj */
  const emails = data.users.map(userObj => userObj.email);
    if(!emails.includes(user.email)){
      // user is not registered
      console.log("user is not registered");
      const login = templates.logIn(`
      <h1>user is not registered. please sign up first</h1>
      <a href='/signup'>Sign up</a>
      `);
      res.send(login);
      
    } 
    else{
      /** check if username and password match */
          // find the user object containing the appropriate username
          const userInDatabase = data.users.find(user => user.email == email);
          const passwordInDatabase = userInDatabase.password;
          const inputPassword = user.password;
          if(inputPassword !== passwordInDatabase){
            // username and password do not match!
            console.log("username and password do not match!");
            const login = templates.logIn(`
            <h1>username and password do not match!</h1>
            <a href='/signup'>Sign up</a>
            `);
            res.send(login);
            return;
          }
      console.log("valid user");
      const token = jwt.sign({user:user},SECRET);
      res.cookie("user", token, { maxAge: 600000 });
      res.redirect('/');
    }
  })
  

server.get('/logout',(req,res)=>{
    res.clearCookie("user");
    res.redirect("/");
})
/** Else */
server.use((req,res)=>{

      res.status(404).send(
      `
      <h1>Invalid URL</h1>
      <a href='/login'>Log in</a>
      `
      );  
    

   
    
})

server.listen(PORT, ()=>{
    console.log("app is starting on port 3000");
})

const posts = [];
const users = [];
const usernames = [];