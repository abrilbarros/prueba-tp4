//captura el formulario
const formulario = document.getElementById("loginForm");

async function loginUsuario(username, password) {
    try {
        const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password})
        })

        if (!response.ok) {
            throw new Error("Usuario o Contraseña incorrectos");
        }

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

    sessionStorage.setItem("rolUsuario", data.role);
    return data;
};


formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("user").value.trim();
    const password= document.getElementById("pass").value.trim();

    const dataUser = await loginUsuario(username, password);

    if (!dataUser) return

    const url = `https://dummyjson.com/users/${dataUser.id}`;
    const usuario = await obtenerUsuario (url);

    if (usuario.role === "admin") {
        window.location.href = "admin-medicos.html";
    }
    else {
        window.location.href = "index.html";
    }
})