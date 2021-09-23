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
let postsList = JSONdata.posts; // postsList = [    {"title":"1","newPost":"a"} , {"title":"2","newPost":"b"}    ]

postsList.forEach((postObj) => {
  const currentPostContainer = document.createElement("div");
  const title = document.createElement("p");
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("fa", "fa-trash", "delete"); // for styling the delete button
  deleteBtn.addEventListener("click", (e) => {
    fetch("delete-post", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(postObj),
    })
      .then((res) => {
        console.log("fetch success");
        console.log("res", res);
        window.location.reload();
      })
      .catch((err) => {
        console.log("fetch fail");
        console.log(err);
      });
  });
  title.innerText = "Title: " + postObj.title;
  let post = document.createElement("p");
  post.innerText = "post: " + postObj.newPost;
  currentPostContainer.appendChild(title);
  currentPostContainer.appendChild(post);
  currentPostContainer.appendChild(deleteBtn);
  postsContainer.appendChild(currentPostContainer);
});
