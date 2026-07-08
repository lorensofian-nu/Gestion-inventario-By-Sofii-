const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com";
const formulario = document.getElementById("formulario");
const listaProductos = document.getElementById("lista-productos");
const inputBuscar = document.getElementById("buscar");

let productos = [];
let idProductoEnEdicion = null;

document.addEventListener("DOMContentLoaded", async () => {
  await mostrarProductos();
  configurarCambioTipo();
});

async function request(url, payload, method) {
  return await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

async function EliminarProductos(id) {
  await fetch(`${URL_BASE}/product/${id}.json`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function EditarProducto(id, producto) {
  await fetch(`${URL_BASE}/product/${id}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(producto)
  });
}

async function mostrarProductos() {
  const lista = await fetch(`${URL_BASE}/product.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  }).then((res) => res.json());

  if (!lista) {
    productos = [];
    renderList([]);
    return;
  }

  const arrayProductos = Object.keys(lista).map(id => ({ id, ...lista[id] }));
  productos = arrayProductos;
  renderList(arrayProductos);
}

function dibujarMateriasPrimas(tipoSeleccionado) {
  const contenedorMaterias = document.getElementById("materias-disponibles");
  if (!contenedorMaterias) return;

  contenedorMaterias.innerHTML = "";

  if (tipoSeleccionado === "Produccion") {
    const materiasPrimas = productos.filter(producto => producto.tipo === "materia-prima");

    if (!materiasPrimas || materiasPrimas.length === 0) {
      contenedorMaterias.innerHTML = "<p>No hay materias primas power ranger</p>";
      return;
    }

    let cuadros = "<label>Materias primas power ranger:</label><br>";
    materiasPrimas.forEach(materiaPrima => {
      cuadros += `
        <div class="option">
            <label>
                <input class="materia-check" type="checkbox" value="${materiaPrima.nombre}">
                <span>${materiaPrima.nombre} (Stock inicial: ${materiaPrima.stock})</span>
                <input type="number" class="cantidad-receta" data-nombre="${materiaPrima.nombre}" placeholder="Cantidad" min="1" required disabled>
            </label>
        </div>
      `;
    });

    contenedorMaterias.innerHTML = cuadros;
    configurarCantidadMateria();
  }
}

function configurarCambioTipo() {
  const TipoProducto = document.getElementById("tipo");
  if (TipoProducto) {
    TipoProducto.addEventListener("change", () => {
      dibujarMateriasPrimas(TipoProducto.value);
    });
  }
}

function configurarCantidadMateria() {
  const checksMateria = document.getElementsByClassName("materia-check");

  for (const el of checksMateria) {
    el.addEventListener("change", () => {
      const cantidadInput = el.parentElement.lastElementChild;
      cantidadInput.toggleAttribute("disabled");
      if (cantidadInput.hasAttribute("disabled")) {
        cantidadInput.value = "";
      }
    });
  }
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(formulario);
  const tipoProducto = data.get("tipo");

  const producto = {
    "nombre": data.get("nombre"),
    "codigo": data.get("codigo"),
    "proveedor": data.get("proveedor"),
    "stock": parseInt(data.get("stock")) || 0,
    "tipo": tipoProducto
  };

  if (idProductoEnEdicion) {
    await EditarProducto(idProductoEnEdicion, producto);
    idProductoEnEdicion = null;

    const botonGuardar = document.getElementById("boton-guardar") || formulario.lastElementChild;
    if (botonGuardar) {
      botonGuardar.innerText = "Guardar";
    }

    const contenedorMaterias = document.getElementById("materias-disponibles");
    if (contenedorMaterias) contenedorMaterias.innerHTML = "";

    formulario.reset();
    await mostrarProductos();
    return;
  }

  let productoListo = false;

  if (tipoProducto === "Produccion") {
    const listaMateriasChequeadas = Array.from(document.querySelectorAll(".materia-check:checked"));

    if (listaMateriasChequeadas.length === 0) {
      alert("Si es producción, debe seleccionar al menos una materia prima Power Ranger.");
      return;
    }

    let stockDisponible = [];

    for (const check of listaMateriasChequeadas) {
      const nombreMateria = check.value;
      const materiaEncontrada = productos.find(p => p.nombre === nombreMateria);

      if (!materiaEncontrada) {
        stockDisponible.push(false);
        continue;
      }

      const input = check.parentElement.lastElementChild;
      const valorRestar = Number(input.value) || 0;
      const totalRequerido = Number(producto.stock * valorRestar);

      stockDisponible.push(materiaEncontrada.stock >= totalRequerido);
    }

    productoListo = stockDisponible.every((disponible) => disponible === true);

    if (productoListo) {
      let resumenMaterias = []; 

      for (const check of listaMateriasChequeadas) {
        const nombreMateria = check.value;
        const materiaEncontrada = productos.find(p => p.nombre === nombreMateria);
        const input = check.parentElement.lastElementChild;
        const valorRestar = Number(input.value) || 0;
        const totalRequerido = Number(producto.stock * valorRestar);

        resumenMaterias.push(`${nombreMateria} (${totalRequerido} uds)`);

        const stockInicial = Number(materiaEncontrada.stock) || 0;
        const nuevoStock = stockInicial - totalRequerido;
        materiaEncontrada.stock = nuevoStock;

        if (materiaEncontrada.id) {
          await fetch(`${URL_BASE}/product/${materiaEncontrada.id}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: nuevoStock })
          });
        }
      }

      await request(`${URL_BASE}/product.json`, producto, "POST");

      
      const procesoProduccion = {
        productoFabricado: producto.nombre,
        cantidadFabricada: producto.stock,
        materiasUsadas: resumenMaterias.join(", ") 
      };
      await request(`${URL_BASE}/produccion.json`, procesoProduccion, "POST");

  
      const componenteProduccion = document.getElementById("vista-produccion");
      if (componenteProduccion) {
        componenteProduccion.cargarHistorial();
      }
    } else {
      alert("upss power ranger: ¡No hay suficiente stock base en las materias primas!");
    }

  } else {
    await request(`${URL_BASE}/product.json`, producto, "POST");
    productoListo = true;
  }

  if (productoListo || tipoProducto !== "Produccion") {
    const contenedorMaterias = document.getElementById("materias-disponibles");
    if (contenedorMaterias) contenedorMaterias.innerHTML = "";
    formulario.reset();
    await mostrarProductos();
  }
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
  const newArray = arrayList.filter((producto) => producto.nombre.toLowerCase().startsWith(inputBuscar.value.toLowerCase()));

  renderList(newArray);
});

function renderList(lista) {
  listaProductos.innerHTML = "";

  let output = "";
  lista.forEach((producto) => {
    output += `
        <tr>
            <td>${producto.nombre}</td>
            <td>${producto.codigo}</td>
            <td>${producto.proveedor}</td>
            <td>${producto.tipo === 'materia-prima' ? 'Materia Prima' : 'Produccion'}</td>
            <td>${producto.stock}</td>
            <td>
                <button class="editar" data-id="${producto.id}">Editar</button>
                <button class="eliminar" data-id="${producto.id}">Eliminar</button>
            </td>
        </tr>
    `;
  });
  listaProductos.innerHTML = output;

  const EliminarProductoBtns = document.getElementsByClassName("eliminar");
  const EditarProductoBtns = document.getElementsByClassName("editar");

  for (const boton of EliminarProductoBtns) {
    boton.addEventListener("click", async () => {
      alert("Eliminar producto power ranger");
      const id = boton.getAttribute("data-id");
      await EliminarProductos(id);
      await mostrarProductos();
    });
  }

  for (const boton of EditarProductoBtns) {
    boton.addEventListener("click", async () => {
      const id = boton.getAttribute("data-id");
      const productoSeleccionado = productos.find(p => p.id === id);

      if (productoSeleccionado) {
        idProductoEnEdicion = id;

        formulario.nombre.value = productoSeleccionado.nombre;
        formulario.codigo.value = productoSeleccionado.codigo;
        formulario.proveedor.value = productoSeleccionado.proveedor;
        formulario.stock.value = productoSeleccionado.stock;

        const selectTipo = document.getElementById("tipo");
        if (selectTipo) {
          selectTipo.value = productoSeleccionado.tipo;
          dibujarMateriasPrimas(productoSeleccionado.tipo);
        }

        const botonGuardar = document.getElementById("boton-guardar") || formulario.lastElementChild;
        if (botonGuardar) {
          botonGuardar.innerText = "Actualizar";
        }
      }
    });
  }
}