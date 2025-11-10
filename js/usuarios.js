import { restringir } from "./herramientas.js";
restringir();
document.addEventListener('DOMContentLoaded', async() =>{
    const tablaUsuariosBody = document.querySelector("#tablaUsuarios tbody")

    try{
        const response = await fetch("https://dummyjson.com/users");

        if(response.ok){
            const usuariosJson = await response.json()
            const usuarios = usuariosJson.users

            usuarios.forEach(user => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                `

        tablaUsuariosBody.appendChild(fila);                
            });
        }else{
            console.error(response.status)
            throw Error ("Error al listar los usuarios")
        }
    }catch(error){
        console.error("Error: ", error)
        alert("Error en la api 'DummyJson'")
    }
})