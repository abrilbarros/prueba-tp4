export function configNavbar() {
    // Verifica si hay usuario logueado
    const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    const btnInicio = document.getElementById("btnInicio");
    const btnCerrar = document.getElementById("btnCierre");
    const menuUsuario = document.getElementById("menuUsuario");
    const btnInicioMob = document.getElementById("btnInicioMob")
    const btnCerrarMob = document.getElementById("btnCierreMob")

    
    if (usuarioLogueado) {
    // Oculta "Iniciar sesión" y muestra "Cerrar sesión" si esta logueado
    btnInicio.classList.add("d-none");
    menuUsuario.classList.remove("d-none");
    btnInicioMob.classList.add("d-none");
    btnCerrarMob.classList.remove("d-none");
    }
    else {
    // Si no hay usuario logueado, mostrar "Iniciar sesión"
    btnInicio.classList.remove("d-none");
    menuUsuario.classList.add("d-none");
    btnInicioMob.classList.remove("d-none");
    btnCerrarMob.classList.add("d-none");
    }

    function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = "index.html";
    }

    btnCerrar.addEventListener("click", cerrarSesion);
    btnCerrarMob.addEventListener("click", cerrarSesion);

    //Solo muestra la pagina "Administrador" en navbar si esta logueado un administrador
    //Solo muestra turnos si no es admin
    const btnAdmin = document.getElementById("adminMed")
    const btnAdminMob = document.getElementById("adminMedMob")
    const btnTurnos = document.getElementById("turnosDropdown")
    const btnTurnosMob = document.getElementById("btnTurnosMob")

    if (usuarioLogueado && usuario.rol === "admin") {
    btnAdmin.classList.remove("d-none")
    btnAdminMob.classList.remove("d-none")
    btnTurnos.classList.add("d-none")
    }

    if (usuarioLogueado && usuario.rol === "user") {
    btnTurnosMob.classList.remove("d-none")
    }

    if(usuarioLogueado){
        const nombreUsuario = document.getElementById("nombreUsuario")
        nombreUsuario.textContent = `${usuario.nombre}(${usuario.rol})`
    }
}

export function restringir() {
    // Verifica si hay usuario logueado
    const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    if (!usuarioLogueado || usuario.rol !== "admin") {
        const alerta = document.createElement("div");
        alerta.className = "alert alert-danger text-center";
        alerta.role = "alert";
        alerta.textContent = "Acceso denegado. Redirigiendo a la página principal.";
        document.body.prepend(alerta);

        setTimeout(() => {
            window.location.href = "index.html";
        },1500);
    }
    else {
        document.getElementById("contenido").style.display = "block";
    }
};