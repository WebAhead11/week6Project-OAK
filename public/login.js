const form = document.getElementById("loginForm");
var token='';
form.addEventListener("submit",(event)=>{
  console.log("preventing default");
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    fetch("http://localhost:3000/login",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify(data),
      }).then(response=>{
        if(!response.ok){ 
			// ex. if error 404
          throw new Error(response.status);
        }
        return response.text();
      })
      .then(response=> {
        document.body.innerHTML = response;
          localStorage.setItem("token",response.token);
       
      })
      .catch(err=>console.log(err));
})