function layout(content){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <nav>
            <a href="/">Home</a>
        </nav>
        ${content}
    </body>
    </html> 
    `
}

function home(email){
    if(email){
        return layout( `
        <h1>Welcome back ${email}</h1>
        <a href='/logout'>Log out</a>
        <br>
        <a href='/posts'>see all posts</a>
        `
        );
    }
    return layout(
        `
        <a href='/login'>Log in</a>
        `
    );

}

function logIn(message){
    if(message){
        return layout(
            `
            
            <h1>Log in to your account</h1>
            <form id='loginForm' method='pOst'>
            <label for='email'>Your email</label>
            <input type='email' name='email' required>
            <label for='password'>Your password</label>
            <input type='password' name='password' required>
            <button type='submit'>Log in</button>
            </form>
            ${message}
            <a href='/signup'>Sign Up</a>
            `
        )
    }else{
        return layout(
            `
            <h1>Log in to your account</h1>
            <form id='loginForm' method='post'>
            <label for='email'>Your email</label>
            <input type='email' name='email' required>
            <label for='password'>Your password</label>
            <input type='password' name='password' required>
            <button type='submit'>Log in</button>
            </form>
            <br>
            <a href='/signup'>Sign Up</a>
            `
        )
    }
    
    
}
function newPost(){
    return layout(`
    <h1>Make a new post</h1>
        <form id='postForm' method='post' action = '/new-post'>
        <label for='title'>Title</label>
        <input type='text' name='title'>
        <label for='newPost'>New Post</label>
        <input type='text' name='newPost'>
        <button type='submit'>Post</button>
        </form>
    `)
}
function posts(content){
    return layout(`
    <h1>All Posts</h1>
    <nav>
    <a href='/new-post'>Make a new Post</a>
    <a href='/logout'>Log Out</a>
    </nav>
    
    <div id='allPosts'></div>
    <script type="module" src='posts.js' param=${content}></script>
        `)
}
function signUp(message){
    if(message){
        return layout(`
        <h1>Sign up</h1>
            <form id='signupForm' action='/signup' method='post'>
            <label for='title'>email</label>
            <input type='text' name='email' required>
            <label for='password'>password</label>
            <input type='text' name='password' required>
            <button type='submit'>sign up</button>
            </form>
            ${message}
        `)
    }else{
        return layout(`
        <h1>Sign up</h1>
            <form id='signupForm' action='/signup' method='post'>
            <label for='title'>email</label>
            <input type='text' name='email' required>
            <label for='password'>password</label>
            <input type='text' name='password' required>
            <button type='submit'>sign up</button>
            </form>
        `)
    }
   
}


module.exports = {home,layout,logIn,newPost,signUp,posts};