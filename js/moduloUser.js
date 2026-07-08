const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com";
const inputBuscarUsuario = document.getElementById("busqueda-usuarios");

let usuarios = [];

document.addEventListener("DOMContentLoaded", async () => {
  await mostrarUsuarios();
  configurarBuscador();
});

async function mostrarUsuarios() {
  const lista = await fetch(`${URL_BASE}/usuarios.json`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then((res) => res.json());

  if (!lista) {
    usuarios = [];
    renderList([]);
    return;
  }

  const arrayUsuarios = Object.keys(lista).map(id => ({ id, ...lista[id] }));
  usuarios = arrayUsuarios;
  renderList(arrayUsuarios);
}

async function EliminarUsuario(id) {
  await fetch(`${URL_BASE}/usuarios/${id}.json`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
}

function configurarBuscador() {
  if (!inputBuscarUsuario) return;

  inputBuscarUsuario.addEventListener("input", () => {
    const textoBuscar = inputBuscarUsuario.value.toLowerCase();
    
    const usuariosFiltrados = usuarios.filter((usuario) => {
      const nombreMatchea = usuario.nombre.toLowerCase().startsWith(textoBuscar);
      const idMatchea = usuario.identificacion.toString().startsWith(textoBuscar);
      return nombreMatchea || idMatchea;
    });

    renderList(usuariosFiltrados);
  });
}

function renderList(lista) {
  const listaUsuarios = document.getElementById("listaUsuarios");
  if (!listaUsuarios) return;

  listaUsuarios.innerHTML = "";

  let output = "";
  lista.forEach((usuario) => {
    output += `
        <tr>
            <td>${usuario.nombre}</td>
            <td>${usuario.cargo || 'No asignado'}</td>
            <td>${usuario.identificacion}</td>
            <td>
                <button class="eliminar" data-id="${usuario.id}">Eliminar</button>
                <button class="editar" data-id="${usuario.id}">Editar</button>
            </td>
        </tr>
    `;
  });
  listaUsuarios.innerHTML = output;

  const botonesEliminar = document.getElementsByClassName("eliminar");
  for (const boton of botonesEliminar) {
    boton.addEventListener("click", async () => {
      const id = boton.getAttribute("data-id");
      alert(`Usuario eliminadoooo power ranger.`);
      await EliminarUsuario(id);
      await mostrarUsuarios();
    });
  }

  const botonesEditar = document.getElementsByClassName("editar");
  for (const boton of botonesEditar) {
    boton.addEventListener("click", async () => {
      const id = boton.getAttribute("data-id");
      alert("Usuario editado power ranger");
      await mostrarUsuarios();
    });
  }
}