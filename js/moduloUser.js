const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com";

document.addEventListener("DOMContentLoaded", async () => {
  await mostrarUsuarios();
});

async function mostrarUsuarios() {
  const lista = await fetch(`${URL_BASE}/usuarios.json`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then((res) => res.json());

  if (!lista) return renderList([]);

  const arrayUsuarios = Object.keys(lista).map(id => ({ id, ...lista[id] }));
  renderList(arrayUsuarios);
}

async function EliminarUsuario(id) {
  await fetch(`${URL_BASE}/usuarios/${id}.json`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
}

function renderList(lista) {
  const listaUsuarios = document.getElementById("listaUsuarios");
  if (!listaUsuarios) return;

  listaUsuarios.innerHTML = "";

  lista.forEach((usuario) => {
    listaUsuarios.innerHTML += `
        <tr>
            <td>${usuario.nombre}</td>
            <td>${usuario.cargo || 'No asignado'}</td>
            <td>${usuario.identificacion}</td>
            <td>
                <button class="eliminar" data-id="${usuario.id}">Eliminar</button>
            </td>
        </tr>
    `;
  });

  const botonesEliminar = document.getElementsByClassName("eliminar");
  for (const boton of botonesEliminar) {
    boton.addEventListener("click", async () => {
      const id = boton.getAttribute("data-id");
      await EliminarUsuario(id);
      await mostrarUsuarios();
    });
  }
}