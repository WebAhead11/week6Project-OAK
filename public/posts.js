/** get script param */
function getSyncScriptParams() {
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length-1];
    var scriptName = lastScript;
    console.log( scriptName);
    return scriptName.getAttribute('param');
}

let encodedData= getSyncScriptParams();
let decodedData=  window.atob(encodedData);
console.log(decodedData);
let JSONdata = JSON.parse(decodedData);

const postsContainer = document.getElementById('allPosts');
let postsList = JSONdata.posts; // postsList = [    {"title":"1","newPost":"a"} , {"title":"2","newPost":"b"}    ]

postsList.forEach( postObj => {
    const currentPostContainer = document.createElement("div");
    const title = document.createElement("p");
    title.innerText =  "Title: " + postObj.title;
    let post = document.createElement("p");
    post.innerText = "post: " + postObj.newPost;
    currentPostContainer.appendChild(title);
    currentPostContainer.appendChild(post);
    postsContainer.appendChild(currentPostContainer);
});

// const post1Container = document.createElement("div"); 
// let title1 = document.createElement("p");
// title1.innerText =  "Title: " + JSONdata.posts[0].title;
// let post1 = document.createElement("p");
// post1.innerText = "post: " + JSONdata.posts[0].newPost;
// post1Container.appendChild(title1);
// post1Container.appendChild(post1);

// const post2Container = document.createElement("div"); 
// let title2 = document.createElement("p");
// title2.innerText =  "Title: " + JSONdata.posts[1].title;
// let post2 = document.createElement("p");
// post2.innerText = "post: " + JSONdata.posts[1].newPost;
// post2Container.appendChild(title2);
// post2Container.appendChild(post2);

// postsContainer.appendChild(post1Container);
// postsContainer.appendChild(post2Container);

console.log(JSONdata.posts[0]);