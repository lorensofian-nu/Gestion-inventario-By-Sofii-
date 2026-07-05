const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com";
const BotonIngresar = document.getElementById("registrar");

let items = [];


BotonIngresar.addEventListener("click", (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const identificacion = document.getElementById("identificacion").value.trim();
    const cargo = document.getElementById("cargo").value.trim();
    const contraseña = document.getElementById("password").value;

    if (!nombre || !identificacion || !cargo || !contraseña) {
        alert("Por favor, llena todos los campos, power ranger");
        return;
    }

    const usuario = {
        "nombre": nombre,
        "identificacion": identificacion,
        "cargo": cargo,
        "password": contraseña
    };

    fetch(`${URL_BASE}/usuarios.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Usuario registrado galácticamente: ", data);
        alert("ya estas registrado,power ranger");
        setTimeout(() => {
            window.location.href = "../pages/login.html";
        }, 1000);
    })
    .catch(err => {
        alert("Hubo un error al registrar el usuario.");
    });
});





