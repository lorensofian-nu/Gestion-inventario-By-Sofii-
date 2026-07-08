class ModuloProduccion extends HTMLElement {
    async connectedCallback() {
    this.innerHTML = `
      <div class="contenedor-produccion">
        <h2>Historial de Procesos de Producción</h2>
        <table>
          <thead>
            <tr>
              <th>Producto Fabricado</th>
              <th>Cantidad</th>
              <th>Materias Primas Usadas</th>
            </tr>
          </thead>
          <tbody id="tabla-cuerpo-produccion">
            <tr>
              <td colspan="3">Cargando procesos...</td>
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
        tablaCuerpo.innerHTML = `<tr><td colspan="3">No se han generado procesos de producción aún.</td></tr>`;
        return;
      }

      const arrayProcesos = Object.keys(respuesta).map(id => respuesta[id]);
      
      let output = "";
      arrayProcesos.forEach((proceso) => {
        output += `
          <tr>
            <td><strong>${proceso.productoFabricado}</strong></td>
            <td>${proceso.cantidadFabricada} uds</td>
            <td><small>${proceso.materiasUsadas}</small></td>
          </tr>
        `;
      });
      
      tablaCuerpo.innerHTML = output;
    } catch (error) {
      tablaCuerpo.innerHTML = `<tr><td colspan="3">Error al cargar el historial.</td></tr>`;
    }
  }
}

customElements.define("modulo-produccion", ModuloProduccion);