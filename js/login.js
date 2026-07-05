const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com";
const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(formulario);
    const nombreIngresado = data.get("nombre").trim();
    const identificacionIngresada = data.get("identificacion").trim();
    const passwordIngresada = data.get("password");

    if (!nombreIngresado || !identificacionIngresada || !passwordIngresada) {
        alert("Por favor, rellene todos los campos.");
        return;
    }

    const respuesta = await fetch(`${URL_BASE}/usuarios.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const listaUsuarios = await respuesta.json();

    if (!listaUsuarios) {
        alert("No hay usuarios registrados en el sistema.");
        return;
    }

    const arrayUsuarios = Object.values(listaUsuarios);

    const usuarioEncontrado = arrayUsuarios.find(usuario =>
        usuario.nombre.trim().toLowerCase() === nombreIngresado.toLowerCase() &&
        usuario.identificacion.toString().trim() === identificacionIngresada &&
        usuario.password === passwordIngresada
    );

    if (usuarioEncontrado) {
        alert(`¡Bienvenido al sistema, ${usuarioEncontrado.nombre}!`);
        window.location.href = "../pages/registrar.html";
    } else {
        alert("Los datos ingresados no coinciden power ranger.");
    }
});