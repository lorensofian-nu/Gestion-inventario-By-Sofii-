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
async function EliminarProductos(id) {
  const Eliminar= await fetch(`${URL_BASE}/product/${id}.json`, {
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json"
    }
  });

}
async function mostrarProductos() {
  const lista = await fetch(`${URL_BASE}/product.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  }).then((res) => res.json());
  
  const arrayProductos = Object.keys(lista).map(id => ({ id, ...lista[id] }));
  renderList(arrayProductos);
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
  formulario.reset();
  await mostrarProductos();
});

inputBuscar.addEventListener("input", async () => {
  const lista = await fetch(`${URL_BASE}/product.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  }).then((res) => res.json());
  if (!lista) return renderList([]);

const arrayList = Object.keys(lista).map(id => ({ id, ...lista[id] }));
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
                <button class="editar" data-id=${producto.id}>Editar</button>
                <button class="eliminar" data-id=${producto.id}>Eliminar</button>
            </td>
        </tr>
    `;
  });
  listaProductos.innerHTML = output;

const EliminarProducto = document.getElementsByClassName("eliminar");
  const EditarProducto = document.getElementsByClassName("editar");

  for (const boton of EliminarProducto) {
    boton.addEventListener("click", async (event) => {
        const id = boton.getAttribute("data-id"); 
        await EliminarProductos(id); 
      
    });
  }
}



