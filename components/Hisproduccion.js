class ModuloProduccion extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <div class="contenedor-produccion">
        <h2>Reporte de los 5 productos más fabricados</h2>

        <div id="boton-producir" >
          <div class="modal-contenido">
            
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Código Proc.</th>
              <th>Producto Fabricado</th>
              <th>Cantidad</th>
              <th>Materias Primas Usadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="tabla-cuerpo-produccion">
          </tbody>
        </table>
      </div>
      <table>

    `;
    await this.cargarHistorial();
  }

  async cargarHistorial() {
    const tablaCuerpo = document.getElementById("tabla-cuerpo-produccion");
    if (!tablaCuerpo) return;

    try {
      const respuesta = await fetch("https://stock-flow-e92c1-default-rtdb.firebaseio.com/produccion.json", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      }).then((res) => res.json());
      const arrayProcesos = Object.keys(respuesta).map(id => respuesta[id]);
      const procesosOrdenados = arrayProcesos.sort((a, b) => {
        return a.cantidadFabricada < b.cantidadFabricada ? 1 : -1
      });

      let output = "";
      const max = 5;
      for (let index = 0; index < max; index++) {
        output += `
          <tr>
            <td># ${procesosOrdenados[index].codigoProceso || 1}</td>
            <td><strong>${procesosOrdenados[index].productoFabricado}</strong></td>
            <td>${procesosOrdenados[index].cantidadFabricada} uds</td>
            <td><small>${procesosOrdenados[index].materiasUsadas}</small></td>
            <td>
              <button class="btn-producir-fila" data-producto="${procesosOrdenados[index].productoFabricado}">
                Producir
              </button>
            </td>
          </tr>

        `;

      }

      tablaCuerpo.innerHTML = output;

      if (typeof window.vincularBotonesFila === "function") {
        window.vincularBotonesFila();
      }

    } catch (error) {
      tablaCuerpo.innerHTML = `<tr><td colspan="5">Error al cargar el historial.</td></tr>`;
    }
  }
}

customElements.define("modulo-produccion", ModuloProduccion);