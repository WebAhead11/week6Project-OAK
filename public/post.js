const form = document.getElementById("postForm");
const token= localStorage.getItem('token');
if(!token){
    throw new Error("token not found in post.js");
}
form.addEventListener("submit",(event)=>{
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    fetch("http://localhost:3000/new-post",{
        method:"Post",
        headers:{"content-type":"application/json",
                 "authorization":token
                },
        body:JSON.stringify(data),
      }).then(response=>{
        if(!response.ok){ 
			// ex. if error 404
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(response=> {
         
      })
      .catch(err=>console.log(err));
})