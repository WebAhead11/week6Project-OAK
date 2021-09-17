/** this server runs on port 3000 */
/** both server should share the same ACCESS_TOKEN_SECRET */
var btoa = require('btoa'); // for encrypting data to send from server to user
const bcrypt = require("bcrypt"); // for hashing passwords
const express = require("express");
const jwt = require("jsonwebtoken");
const cors =  require("cors"); // for heroku
const cookieParser = require("cookie-parser");
const templates = require("./templates.js");
var fs = require('fs');
const server = express();
const ACCESS_TOKEN_SECRET = 'shhhhhh';
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
    if(token){
      // if a user is logged in
      const user = jwt.verify(token,ACCESS_TOKEN_SECRET);
      req.user = user;
    }
    next();
  });
  // server.use('/',(req,res,next)=>{
  //   const token = req.cookies.user;
  //   if(token){

  //   }
  // });

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
    let stringObj = JSON.stringify(data);
    encodedData = btoa(stringObj);
    const posts = templates.posts(encodedData );
   // console.log("posts in server",JSON.stringify(data));
    res.send(posts);    
  }
    
})
server.get('/signup',(req,res)=>{
  const signup = templates.signUp();
  res.send(signup);
})
server.post('/signup',async (req,res)=>{
  try{
    const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password,salt);
  const user = {email:req.body.email, password:hashedPassword};
  const email = user.email;
  /** read users.json */
  const jsonData = require('./database/users.json');
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
  
    console.log("signed up",email);
  
    res.send(`
            <h3>Signed up successfully!</h3>
            <a href='/login'>Log in to verify your account</a>
    `)
  }catch(err){
    console.log(err);
  }
  
})
server.get('/login', (req,res)=>{  
 
    const login = templates.logIn();
    res.send(login);
})

server.post('/login',(req,res)=>{
 //  res.redirect("http://localhost:4000/login");

})

server.get('/logout',(req,res)=>{
    const token = req.cookies.user;
    const user = jwt.verify(token,ACCESS_TOKEN_SECRET);
    console.log( user.user.email," logged out");
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
    console.log(`app is starting on port ${PORT}`);
})