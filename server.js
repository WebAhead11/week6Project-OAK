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

  
  if(!fs.existsSync('./users.json')){
    const data = {
      "users":[]
    };
    fs.writeFileSync('./users.json', JSON.stringify(data)); // create an empty file if doesn't exist
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
   posts.push(newPost);
   console.log(posts);
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
    res.send(posts);    
  }
    
})
server.get('/signup',(req,res)=>{
  const signup = templates.signUp();
  res.send(signup);
})
server.post('/signup',(req,res)=>{
  const user = {email:req.body.email, password:req.body.password};
  const email = user.email;

 // var data = JSON.stringify(email);
  /** read users.json */
  const jsonData = require('./users.json');
  console.log('jsonData',jsonData);
  jsonData.users.push(email);
/** save usernames locally on the server */
  fs.writeFile('./users.json', JSON.stringify(jsonData) , function (err) {
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
  
    try{
      var data = require('./users.json');
       
    }catch(err){
      console.log(err);
    }
   console.log("data",data);
  
    // try{
    //   var myObj = JSON.parse(data);
    // }catch(err){
    //   console.log("error parsing json");
    // }
    if(!data.users.includes(user.email)){
      // user is not registered
      console.log("user is not registered");
      const login = templates.logIn(`
      <h1>user is not registered. please sign up first</h1>
      <a href='/signup'>Sign up</a>
      `);
      res.send(login);
    }
    else{
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