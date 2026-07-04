const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com";
const formulario = document.getElementById("formulario");
const listaProductos = document.getElementById("lista-productos");
const inputBuscar = document.getElementById("buscar");

let productos = [];

document.addEventListener("DOMContentLoaded", async () => {
  await mostrarProductos();
});

async function requestHTTP(url, payload, method) {
  return await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

async function mostrarProductos() {
  const lista = await fetch(`${URL_BASE}/product.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  }).then((res) => res.json());
  
  renderList(lista);
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(formulario);

  const product = {
    "nombre": data.get("nombre"),
    "codigo": data.get("codigo"),
    "proveedor": data.get("proveedor"),
    "stock": parseInt(data.get("stock")),
    "tipo": data.get("tipo")
  };

  await requestHTTP(`${URL_BASE}/product.json`, product, "POST")
});

inputBuscar.addEventListener("input", async () => {
  const lista = await fetch(`${URL_BASE}/product.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  }).then((res) => res.json());

  const arrayList = Object.values(lista);
  const newArray = arrayList.filter((producto)=> producto.nombre.startsWith(inputBuscar.value));

  renderList(newArray);
})

function renderList(lista) {
  listaProductos.innerHTML = "";

  let output = "";
  lista.forEach((producto) => {
    output += `
        <tr>
            <td>${producto.nombre}</td>
            <td>${producto.codigo}</td>
            <td>${producto.proveedor}</td>
            <td>${producto.tipo === 'materia-prima' ? 'Materia Prima' : 'Producto Terminado'}</td>
            <td>${producto.stock}</td>
            <td>
                <button class="editar">Editar</button>
                <button class="eliminar">Eliminar</button>
            </td>
        </tr>
    `;
  });
  listaProductos.innerHTML = output;
}