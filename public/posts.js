/** get script param */
function getSyncScriptParams() {
  var scripts = document.getElementsByTagName("script");
  var lastScript = scripts[scripts.length - 1];
  var scriptName = lastScript;
  console.log(scriptName);
  return scriptName.getAttribute("param");
}

let encodedData = getSyncScriptParams();
let decodedData = window.atob(encodedData);
console.log(decodedData);
let JSONdata = JSON.parse(decodedData);

const postsContainer = document.getElementById("allPosts");
let postsList = JSONdata.posts; // postsList = [    {"title":"1","text_content":"a"} , {"title":"2","text_content":"b"}    ]

postsList.forEach((postObj) => {
  const currentPostContainer = document.createElement("div");
  const title = document.createElement("p");
  const user = document.createElement("p");
  /** get username from DB using user_id */
  const email = postObj.email;
  user.innerText = email;
  title.innerText = "Title: " + postObj.title;
  let post = document.createElement("p");
  post.innerText = "post: " + postObj.text_content;

  currentPostContainer.appendChild(title);
  currentPostContainer.appendChild(post);
  currentPostContainer.appendChild(user);
  postsContainer.appendChild(currentPostContainer);
});

console.log(JSONdata.posts[0]);
