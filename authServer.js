/** this server is for authentication and runs on port 4000 */
const bcrypt = require("bcrypt"); // for hashing passwords
const express = require("express");
const jwt = require("jsonwebtoken");
const cors =  require("cors"); // for heroku
const cookieParser = require("cookie-parser");
const templates = require("./templates.js");
const server = express();
const ACCESS_TOKEN_SECRET = 'shhhhhh';
const PORT = process.env.PORT || 4000; 
server.use(cors());
/** Logger */
server.use((req,res,next)=>{
    console.log(req.method,req.url);
    next();
})

server.use(cookieParser());
server.use(express.urlencoded()); // for POST requests
server.use(express.json()); // for POST request in JSON format
server.use(express.static('./public'));

server.get('/',(req,res)=>{
  res.redirect('http://localhost:3000/');
})
server.get('/login',(req,res)=>{
  res.redirect('http://localhost:3000/login');
})
server.get('/signup',(req,res)=>{
  res.redirect('http://localhost:3000/signup');
})
server.get('/logout',(req,res)=>{
  res.redirect('http://localhost:3000/logout');
})
server.get('/new-post',(req,res)=>{
  res.redirect('http://localhost:3000/new-post');
})
server.get('/posts',(req,res)=>{
  res.redirect('http://localhost:3000/posts');
})

server.post('/login',async (req,res)=>{ // bcrypt is an asnyc library
  try{
    var data = require('./database/users.json');
   
    const user = {email:req.body.email, password:req.body.password};

    const email = user.email;

    /** map the data.users array to include only emails instead of a user obj */
    const emails = data.users.map(userObj => userObj.email);
      if(!emails.includes(user.email)){
        // user is not registered
        console.log("user is not registered");
        const login = templates.logIn(`
        <h1>user is not registered. please sign up first</h1>
        `);
        res.send(login);
        
      } 
      else{
        /** check if username and password match */
            // find the user object containing the appropriate username
            const userInDatabase = data.users.find(user => user.email == email);
            const passwordInDatabase = userInDatabase.password; //our hashed password from database
            const inputPassword = user.password; // plaintext password given by user when trying to log in
            const passwordsMatch = await bcrypt.compare(inputPassword,passwordInDatabase); // compare(plaintext_password,hashed_password)
            if(!passwordsMatch){
              // username and password do not match!
               console.log("username and password do not match!");
              const login2 = templates.logIn(`
              <h1>username and password do not match!</h1>
              `);
              res.send(login2);
              return;
            }
        const token = jwt.sign({user:user},ACCESS_TOKEN_SECRET);
       
        res.cookie("user", token, { maxAge: 900000 }); // log in user
        console.log(user.email," logged in");
        res.redirect('http://localhost:3000/');
      }
  }catch(err){
    console.log(err);
  }
    
 
  })
  



server.listen(PORT, ()=>{
    console.log(`app is starting on port ${PORT}`);
})

