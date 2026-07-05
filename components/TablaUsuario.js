class BusquedaUsuarios extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `

        <main class="modulo-usuario">
                <h1 class="titulo">Gestión de Usuarios</h1>
                <div class="busqueda">
                    <input
                        type="text"
                        id="buscar"
                        placeholder="Buscar usuario">
                        <a class="btnInicio" href="../index.html"  > Añadir nuevo Usuario</a>
                </div>

            <div class="datos-usuarios">
                <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>cargo</th>
                        <th>Identificacion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                    <tbody id="listaUsuarios">
         
                    </tbody>
                </table>
            </div>
        </main>
        `;
    }
}

customElements.define("busqueda-usuarios", BusquedaUsuarios);