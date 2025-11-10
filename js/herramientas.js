export function configNavbar() {
    const btnInicio = document.getElementById("btnInicio");
    const btnCerrar = document.getElementById("btnCierre");
    const menuUsuario = document.getElementById("menuUsuario");
    const btnInicioMob = document.getElementById("btnInicioMob")
    const btnCerrarMob = document.getElementById("btnCierreMob")

    // Verifica si hay usuario logueado
    const usuario = sessionStorage.getItem("usuarioLogueado");
    const rol = sessionStorage.getItem("rolUsuario");

    if (usuario) {
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
    const botTurnos = document.getElementById("turnosDropdown")

    if (usuario && rol === "admin") {
    btnAdmin.classList.remove("d-none")
    btnAdminMob.classList.remove("d-none")
    botTurnos.classList.add("d-none")
    }
}