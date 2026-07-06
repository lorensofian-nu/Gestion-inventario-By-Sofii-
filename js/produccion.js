document.addEventListener("DOMContentLoaded", () => {
  const TipoProducto = document.getElementById("tipo");

  if (TipoProducto) {
    TipoProducto.addEventListener("change", () => {
      const contenedorMaterias = document.getElementById("materias-disponibles");
      contenedorMaterias.innerHTML = "";

      if (TipoProducto.value === "Produccion") {
        const materiasPrimas = productos.filter(producto => producto.tipo === "materia-prima");

        if (materiasPrimas.length === null) {
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

            productos.forEach(producto => {
              if (producto.nombre === nombreMateria && producto.tipo === "materia-prima") {
                producto.stock = stockInicial - valorRestar;
              }
            });

            renderList(productos);
          });
        }
      }
    });
  }
});