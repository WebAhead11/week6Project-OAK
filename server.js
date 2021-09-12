const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const templates = require("./templates.js");
const server = express();
const SECRET = 'shhhhhh';
/** Logger */
server.use((req,res,next)=>{
    console.log(req.method,req.url);
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
server.get('/login',(req,res)=>{
    const login = templates.logIn();
    res.send(login);
})
// TOKEN FORMAT: authorization: Bearer <access_token>
server.post('/login',(req,res)=>{

    console.log("server.post:/login ",req.body);
    const user = {email:req.body.email, password:req.body.password};
    console.log("user", user);
    const token = jwt.sign({user:user},SECRET);
    res.cookie("user", token, { maxAge: 600000 });
    
    res.json({
        token:token
    });

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

server.listen(3000, ()=>{
    console.log("app is starting on port 3000");
})

const posts = [];
const users = [];