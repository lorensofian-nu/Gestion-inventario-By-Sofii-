const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com";
const formulario = document.getElementById("formulario")

const httpClient = (product) => {
  fetch(`${URL_BASE}/product.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(formulario);
  const product = {
    "nombre": data.get("nombre"),
    "codigo": data.get("codigo"),
    "proveedor": data.get("proveedor"),
    "stock": data.get("stock")
  }
  const res = httpClient(product).then(data => data.json());
  res.then(data => console.log(data)).catch(err => console.error(err))
});


inputBuscar.addEventListener('input', function() {
    const texto = inputBuscar.value.toLowerCase().trim();

    const productosFiltrados = productos.filter(producto => {
        return producto.nombre.toLowerCase().includes(texto) || 
               producto.codigo.toLowerCase().includes(texto);
    });

    mostrarProductos(productosFiltrados);
});
