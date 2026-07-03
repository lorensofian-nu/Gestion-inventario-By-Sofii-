
const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com";

const botonInicio = document.getElementById("IniciarSesion");

botonInicio.addEventListener("click", (event) => {

    event.preventDefault();

    const identificacion = document.getElementById("identificacion").value;
    const contraseña = document.getElementById("password").value;
    if (!identificacion || !contraseña) {
         mensaje.textContent = "Por favor, llena todos los campos.";
        return;
    }
