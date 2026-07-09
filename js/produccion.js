document.addEventListener("DOMContentLoaded", () => {
  const TipoProducto = document.getElementById("tipo");
  const modal = document.getElementById("modal-produccion");
  const btnCerrarModal = document.getElementById("btn-cerrar-modal");
  const formModal = document.getElementById("form-modal-produccion");
  const contenedorMateriasModal = document.getElementById("materias-disponibles-modal");

  if (btnCerrarModal && modal) {
    btnCerrarModal.addEventListener("click", () => {
      modal.style.display = "none";
      formModal.reset();
    });
  }

  window.vincularBotonesFila = function() {
    const botonesProducir = document.getElementsByClassName("btn-producir-fila");

    for (const boton of botonesProducir) {
      boton.addEventListener("click", () => {
        const nombreProducto = boton.getAttribute("data-producto");
        
        document.getElementById("prod-nombre").value = nombreProducto;
        modal.style.display = "flex";

        dibujarMateriasPrimasModal();
      });
    }
  };

  function dibujarMateriasPrimasModal() {
    if (!contenedorMateriasModal) return;
    contenedorMateriasModal.innerHTML = "";

    const listaProductosGlobal = window.productos || [];
    const materiasPrimas = listaProductosGlobal.filter(p => p.tipo === "materia-prima");

    let cuadros = "<label>Materias primas requeridas por unidad:</label><br>";
    
    materiasPrimas.forEach(materia => {
      cuadros += `
        <div>
          <label>${materia.nombre} (Disponible: ${materia.stock})</label>
          <input type="number" class="cantidad-modal-receta" data-nombre="${materia.nombre}" placeholder="Cantidad" min="0" value="0">
        </div>
      `;
    });

    contenedorMateriasModal.innerHTML = cuadros;
  }

  if (formModal) {
    formModal.addEventListener("submit", async (event) => {
      event.preventDefault();

      const cantidadAProducir = parseInt(document.getElementById("prod-stock").value) || 0;
      const inputsCantidadModal = document.getElementsByClassName("cantidad-modal-receta");
      const listaProductosGlobal = window.productos || [];
      
      let actualizaciones = [];
      let resumenMaterias = [];
      let stockSuficiente = true;

      for (const input of inputsCantidadModal) {
        const cantidadPorUnidad = parseInt(input.value) || 0;
        
        if (cantidadPorUnidad > 0) {
          const nombreMateria = input.getAttribute("data-nombre");
          const totalRequerido = cantidadAProducir * cantidadPorUnidad;
          const materiaEncontrada = listaProductosGlobal.find(p => p.nombre === nombreMateria && p.tipo === "materia-prima");

          if (!materiaEncontrada || materiaEncontrada.stock < totalRequerido) {
            alert(`No hay suficiente stock de ${nombreMateria}. Requerido: ${totalRequerido}`);
            stockSuficiente = false;
            break;
          }

          resumenMaterias.push(`${nombreMateria}: ${totalRequerido} uds`);
          actualizaciones.push({
            id: materiaEncontrada.id,
            nuevoStock: materiaEncontrada.stock - totalRequerido,
            materia: materiaEncontrada
          });
        }
      }

      if (!stockSuficiente) return;

      if (resumenMaterias.length === 0) {
        alert("Debes asignar al menos una materia prima.");
        return;
      }

      const historial = await fetch(`${URL_BASE}/produccion.json`).then(res => res.json());
      const siguienteCodigo = historial ? Object.keys(historial).length + 1 : 1;

      for (const item of actualizaciones) {
        item.materia.stock = item.nuevoStock;
        await fetch(`${URL_BASE}/product/${item.id}.json`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: item.nuevoStock })
        });
      }

      const nombreProdFabricado = document.getElementById("prod-nombre").value;
      const productoExistente = listaProductosGlobal.find(p => p.nombre === nombreProdFabricado && p.tipo === "Produccion");

      if (productoExistente) {
        const nuevoStockProducto = productoExistente.stock + cantidadAProducir;
        productoExistente.stock = nuevoStockProducto;
        await fetch(`${URL_BASE}/product/${productoExistente.id}.json`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: nuevoStockProducto })
        });
      } else {
        const nuevoProducto = {
          "nombre": nombreProdFabricado,
          "codigo": "PROD-" + siguienteCodigo,
          "proveedor": "Interno",
          "stock": cantidadAProducir,
          "tipo": "Produccion"
        };
        await fetch(`${URL_BASE}/product.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoProducto)
        });
      }

      const procesoProduccion = {
        codigoProceso: siguienteCodigo,
        productoFabricado: nombreProdFabricado,
        cantidadFabricada: cantidadAProducir,
        materiasUsadas: resumenMaterias.join(", ")
      };

      await fetch(`${URL_BASE}/produccion.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(procesoProduccion)
      });

      alert(`Resumen de Producción:\n\nProceso Nº: ${procesoProduccion.codigoProceso}\nProducto: ${procesoProduccion.productoFabricado}\nCantidad: +${procesoProduccion.cantidadFabricada} uds\nMaterias usadas: ${procesoProduccion.materiasUsadas}`);

      modal.style.display = "none";
      formModal.reset();
      
      const componenteProduccion = document.querySelector("modulo-produccion");
      if (componenteProduccion) {
        await componenteProduccion.cargarHistorial();
      }
      if (typeof mostrarProductos === "function") {
        await mostrarProductos();
      }
    });
  }

  if (TipoProducto) {
    TipoProducto.addEventListener("change", () => {
      const contenedorMaterias = document.getElementById("materias-disponibles");
      contenedorMaterias.innerHTML = "";
      const listaProductosGlobal = window.productos || [];

      if (TipoProducto.value === "Produccion") {
        const materiasPrimas = listaProductosGlobal.filter(producto => producto.tipo === "materia-prima");

        if (materiasPrimas.length === 0) {
          contenedorMaterias.innerHTML = "<p>No hay materias primas power ranger</p>";
          return;
        }

        let cuadros = "<label>Materias primas power ranger:</label><br>";
        materiasPrimas.forEach(materiaPrima => {
          cuadros += `
            <div>
              <label>${materiaPrima.nombre} (Stock inicial: ${materiaPrima.stock})</label>
              <input type="number" class="cantidad-receta" data-nombre="${materiaPrima.nombre}" data-stock-inicial="${materiaPrima.stock}" name="cantidad-${materiaPrima.nombre}" placeholder="Cantidad" min="0">
            </div>
          `;
        });

        contenedorMaterias.innerHTML = cuadros;

        const inputsCantidad = document.getElementsByClassName("cantidad-receta");

        for (const input of inputsCantidad) {
          input.addEventListener("input", () => {
            const nombreMateria = input.getAttribute("data-nombre");
            const stockInicial = parseInt(input.getAttribute("data-stock-inicial")) || 0;
            const valorRestar = parseInt(input.value) || 0;

            listaProductosGlobal.forEach(producto => {
              if (producto.nombre === nombreMateria && producto.tipo === "materia-prima") {
                producto.stock = stockInicial - valorRestar;
              }
            });

            if (typeof renderList === "function") {
              renderList(listaProductosGlobal);
            }
          });
        }
      }
    });
  }
});