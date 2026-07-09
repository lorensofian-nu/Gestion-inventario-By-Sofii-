class ModuloProduccion extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <div class="contenedor-produccion">
        <h2>Historial de Procesos de Producción</h2>

        <div id="modal-produccion" style="display: none;">
          <div class="modal-contenido">
            <span id="btn-cerrar-modal">&times;</span>
            <h3>Registrar Proceso de Producción</h3>
            
            <form id="form-modal-produccion">
              <label>Nombre del Producto a Fabricar:</label>
              <input type="text" id="prod-nombre" readonly required>

              <label>Cantidad a Producir (Stock):</label>
              <input type="number" id="prod-stock" min="1" required>

              <div id="materias-disponibles-modal"></div>

              <button type="submit">Confirmar y Descontar</button>
            </form>
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
            <tr>
              <td colspan="5">Cargando procesos...</td>
            </tr>
          </tbody>
        </table>
      </div>
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

      if (!respuesta) {
        tablaCuerpo.innerHTML = `<tr><td colspan="5">No se han generado procesos de producción aún.</td></tr>`;
        return;
      }

      const arrayProcesos = Object.keys(respuesta).map(id => respuesta[id]);
      
      let output = "";
      arrayProcesos.forEach((proceso) => {
        output += `
          <tr>
            <td># ${proceso.codigoProceso || 1}</td>
            <td><strong>${proceso.productoFabricado}</strong></td>
            <td>${proceso.cantidadFabricada} uds</td>
            <td><small>${proceso.materiasUsadas}</small></td>
            <td>
              <button class="btn-producir-fila" data-producto="${proceso.productoFabricado}">
                Producir
              </button>
            </td>
          </tr>
        `;
      });
      
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