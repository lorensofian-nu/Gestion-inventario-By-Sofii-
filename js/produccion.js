document.addEventListener("DOMContentLoaded", async () => {
  const TipoProducto = document.getElementById("tipo");

  if (TipoProducto) {
    TipoProducto.addEventListener("change", () => {
      const contenedorMaterias = document.getElementById("materias-disponibles");
      contenedorMaterias.innerHTML = "";

      if (TipoProducto.value === "Produccion") {
        const materiasPrimas = productos.filter(p => p.tipo === "materia-prima");

        if (materiasPrimas.length === 0) {
          contenedorMaterias.innerHTML = "<p>No hay materias primas power ranger</p>";
          return;
        }

        let cuadro = "<label>Materias primas power ranger:</label><br>";
        materiasPrimas.forEach(mp => {
          cuadro += `
            <label>
              <input type="checkbox" name="receta" value="${mp.nombre}"> ${mp.nombre} (${mp.stock})
            </label><br>
          `;
        });
        contenedorMaterias.innerHTML = cuadro;
      }
    });
  }
});