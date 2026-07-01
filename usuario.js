const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com"
const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(formulario);
  const user = {
    "username": data.get("username"),
    "name": data.get("nombre"),
    "password": data.get("password")
  }
  const res = httpClient(user).then(data => data.json());
  res.then(data => console.log(data)).catch(err => console.error(err))
});

const httpClient = (user) => {
  fetch(`${URL_BASE}/user.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });
}




