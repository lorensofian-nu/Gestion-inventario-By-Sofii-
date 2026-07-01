const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com"
const formulario = document.getElementById("formulario"); 

const httpClient= fetch(`${URL_BASE}/user.json`,{
  method:"POST",
  header:{
    "Content-Type": "application/json"
  },
  body: JSON.stringify(user)
});

const res= httpClient.then(data=> data.json());
res.then(data=> console.log).catch(err=> console.error)


