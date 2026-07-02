const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com";
const formulario = document.getElementById("formulario");
const listaProductos = document.getElementById("lista-productos");
const inputBuscar = document.getElementById("buscar");

let productos = [];

const httpClient = (product) => {
  return fetch(`${URL_BASE}/product.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
}

function mostrarProductos(listaFiltrar = productos) {
  const ListaInventario = listaFiltrar.map((producto) => {
    return `
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
  listaProductos.innerHTML = ListaInventario
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const data = new FormData(formulario);
  
  const product = {
    "nombre": data.get("nombre"),
    "codigo": data.get("codigo"),
    "proveedor": data.get("proveedor"),
    "stock": parseInt(data.get("stock")),
    "tipo": data.get("tipo")
  };

  httpClient(product)
    .then(response => response.json())
    .then(data => {
      console.log("producto guardado galacticoo", data);
      productos.push(product);
      mostrarProductos();
      formulario.reset();
    })
    .catch(err => console.error(err));
});

inputBuscar.addEventListener('input', () => {
    const texto = inputBuscar.value.toLowerCase().trim();

    const productosFiltrados = productos.filter(producto => {
        return producto.nombre.toLowerCase().includes(texto) || 
               producto.codigo.toLowerCase().includes(texto);
    });

    mostrarProductos(productosFiltrados);
});