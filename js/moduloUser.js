const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com";

document.addEventListener("DOMContentLoaded", async () => {
  await mostrarUsuarios();
});

async function mostrarUsuarios() {
  const lista = await fetch(`${URL_BASE}/usuarios.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  }).then((res) => res.json());

  if (!lista) return renderList([]);

  const arrayUsuarios = Object.keys(lista).map(id => ({ id, ...lista[id] }));
  renderList(arrayUsuarios);
}

function renderList(lista) {
  const componente = document.querySelector("busqueda-usuarios");
  if (!componente) return;
  
  const listaUsuarios = componente.querySelector("#listaUsuarios");
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
            </td>
        </tr>
    `;
  });
  listaUsuarios.innerHTML = output;
} 