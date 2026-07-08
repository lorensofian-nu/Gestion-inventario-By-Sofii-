class ModuloProductos extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <main id="contenedor">
        <h1 id="titulo">Inventario</h1>

        <form id="formulario">
          <input type="text" id="nombre" name="nombre" placeholder="Nombre">
          <input type="text" id="codigo" name="codigo" placeholder="Codigo">
          <input type="text" id="proveedor" name="proveedor" placeholder="Proveedor">
          <input type="number" id="stock" name="stock" placeholder="Stock">

          <select id="tipo" name="tipo">
            <option value="materia-prima">Materia Prima</option>
            <option value="Produccion">Produccion</option>
          </select>
          <div id="materias-disponibles"></div>
          <button type="submit" id="guardarProducto">Guardar</button>
        </form>

        <div class="buscarProducto">
          <input type="text" id="buscar" placeholder=" Buscar productosss">
        </div>

        <div class="tablaProductos">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Código</th>
                <th>Proveedor</th>
                <th>Tipo</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="lista-productos"></tbody>
          </table>
        </div>
      </main>
    `;
  }
}

customElements.define("modulo-productos", ModuloProductos);