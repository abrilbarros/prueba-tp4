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
    if(btnInicio) btnInicio.classList.add("d-none");
    if(menuUsuario) menuUsuario.classList.remove("d-none");
    if(btnInicioMob) btnInicioMob.classList.add("d-none");
    if(btnCerrarMob) btnCerrarMob.classList.remove("d-none");
    }
    else {
    // Si no hay usuario logueado, mostrar "Iniciar sesión"
    if(btnInicio)btnInicio.classList.remove("d-none");
    if(menuUsuario) menuUsuario.classList.add("d-none");
    if(btnInicioMob) btnInicioMob.classList.remove("d-none");
    if(btnCerrarMob)btnCerrarMob.classList.add("d-none");
    }

    function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = "index.html";
    }

    if(btnCerrar) btnCerrar.addEventListener("click", cerrarSesion);
    if(btnCerrarMob)btnCerrarMob.addEventListener("click", cerrarSesion);

    //Solo muestra la pagina "Administrador" en navbar si esta logueado un administrador
    //Solo muestra turnos si no es admin
    const btnAdmin = document.getElementById("adminMed")
    const btnAdminMob = document.getElementById("adminMedMob")
    const btnTurnos = document.getElementById("turnosDropdown")
    const btnTurnosMob = document.getElementById("btnTurnosMob")
    const turnosDesk = document.getElementById("turnosDesk")


    if (usuarioLogueado && usuario.rol === "admin") {
        if(btnAdmin) btnAdmin.classList.remove("d-none")
        if(btnAdminMob) btnAdminMob.classList.remove("d-none")
        if(btnTurnos) btnTurnos.classList.add("d-none")
        if(btnTurnosMob) btnTurnosMob.classList.add("d-none")
    }

    if(usuarioLogueado){
        const nombreUsuario = document.getElementById("nombreUsuario")
        nombreUsuario.textContent = `${usuario.nombre}(${usuario.rol})`
        if(turnosDesk)turnosDesk.classList.add("d-none")
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
        document.getElementById("contenido").classList.remove("d-none");
    }
};