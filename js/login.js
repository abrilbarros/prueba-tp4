//captura el formulario
const formulario = document.getElementById("loginForm");

async function loginUsuario(username, password) {
    try {
        const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password})
        })
        const mensaje = document.getElementById("mensaje");
        if (!response.ok) {
            mensaje.className = "alert alert-danger text-center"
            mensaje.role = "alert"
            mensaje.textContent = "Usuario o Contraseña incorrectos"
            return null
        }

        mensaje.className = "alert alert-success text-center"
            mensaje.role = "alert"
            mensaje.textContent = "Bienvenido ✅"

        const data = await response.json();
        sessionStorage.setItem("usuarioLogueado", data.accessToken);
        return data;
        
    }
    catch (error) {
        alert(error.message);
    };    
}

async function obtenerUsuario(url) {
    const response = await fetch (url);
    const data = await response.json();
    const DataUsuario = {nombre: data.firstName, apellido: data.lastName, rol: data.role};


    sessionStorage.setItem("usuario", JSON.stringify(DataUsuario));
    return DataUsuario;
};


formulario.addEventListener("submit", async function(event) {
    event.preventDefault();
    const btnLoad = document.getElementById("btnLoad")
    const btnLogin = document.getElementById("btnLogin")
    const username = document.getElementById("user").value.trim();
    const password= document.getElementById("pass").value.trim();
    
    btnLogin.classList.add("d-none")
    btnLoad.classList.remove("d-none")
    
    const dataUser = await loginUsuario(username, password);

    if (!dataUser){
        btnLoad.classList.add("d-none")
        btnLogin.classList.remove("d-none")
        return
    }

    const url = `https://dummyjson.com/users/${dataUser.id}`;
    const usuario = await obtenerUsuario (url);

    if (usuario.rol === "admin") {
        setTimeout(() => {
            window.location.href = "admin-medicos.html";
        },1000);
    }
    else {
        setTimeout(() => {
            window.location.href = "index.html";
        },1000);
    }
})