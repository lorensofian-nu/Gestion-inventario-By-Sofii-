class MenuNavegacion extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="menu-principal">
        <div class="menu-links">
          <a href="../index.html">Home</a>
          <a href="../index.html">Registrar usuarios</a>
          <a href="registrar.html">Registro de productos</a>
          <a href="ModuloUsuario.html">Modulo usuario</a>
          <a href="moduloProdu.html">Modulo produccion</a>
        </div>
      </nav>
    `;
  }
}
customElements.define("menu-navegacion", MenuNavegacion);