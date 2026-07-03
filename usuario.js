const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com"
const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(formulario);
  const user = {
    "usuario": data.get("nombre"),
    "identificacion": data.get("identificacion"),
    "cargo": data.get("cargo"),
    "password": data.get("password")
  }
  await httpClient(`${URL_BASE}/product.json`, user, "POST");
  window.location.href = "login.html";
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





