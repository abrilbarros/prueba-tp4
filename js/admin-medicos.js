
// ==================== IMPORTS Y CONFIGURACIÓN ====================

import { restringir } from "./herramientas.js";
restringir();
const STORAGE_KEY = "medicos";

// ==================== FUNCIONES DE PERSISTENCIA ====================

function obtenerMedicos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function guardarMedicosEnStorage(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject("Error al leer la imagen");
        reader.readAsDataURL(file);
    });
}

// ==================== FUNCIONES CRUD ====================

async function guardarMedico() {
    const id = medicoIdInput.value;
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const matricula = matriculaInput.value.trim();
    const especialidad = especialidadInput.value.trim();
    const obraSocial = Array.from(document.querySelectorAll("#obraSocialContainer input[type=checkbox]:checked")).map(cb => cb.value);
    const valorConsulta = parseInt(valorConsultaInput.value, 10);
    const descripcion = descripcionInput.value.trim();


    if (!matricula || !nombre || !apellido || !especialidad) {
        alert("Por favor, completá todos los campos obligatorios.");
        return;
    }

    if (isNaN(valorConsulta) || valorConsulta <= 0) {
        alert("El valor de los honorarios debe ser un número entero mayor que 0");
        return;
    }


    const medicoData = {
        apellidoNombre: `${nombre} ${apellido}`,
        matricula,
        especialidad,
        email: "",
        telefono: "",
        honorarios: valorConsulta,
        obrasSociales: obraSocial,
        bio: descripcion
    };

    if (fotoMedicoInput.files && fotoMedicoInput.files[0]) {
        try {
            medicoData.foto = await convertirImagenABase64(fotoMedicoInput.files[0]);
        } catch (error) {
            alert("Error al procesar la imagen");
            return;
        }
    }

    if (id) {
        editarMedicoExistente(parseInt(id), medicoData);
    } else {
        agregarMedico(medicoData);
    }
}

function agregarMedico(medicoData) {
    let medicos = obtenerMedicos();

    const idsExistentes = medicos
        .map(m => m.id)
        .filter(n => typeof n === "number" && !isNaN(n));

    const nuevoId = idsExistentes.length > 0 ? Math.max(...idsExistentes) + 1 : 1;
    medicoData.id = nuevoId;

    if (!medicoData.foto) {
        medicoData.foto = 'img/doctor-placeholder.jpg';
    }

    medicos.push(medicoData);
    guardarMedicosEnStorage(medicos);
    cargarMedicos();
    limpiarFormulario();
    alert("Médico agregado con éxito");
}


function editarMedicoExistente(id, medicoData) {
    let medicos = obtenerMedicos();
    const medicoIndex = medicos.findIndex(med => med.id == id);

    if (medicoIndex === -1) return;

    if (!medicoData.foto) {
        medicoData.foto = medicos[medicoIndex].foto || 'img/doctor-placeholder.jpg';
    }

    medicos[medicoIndex] = { ...medicos[medicoIndex], ...medicoData };

    guardarMedicosEnStorage(medicos);
    cargarMedicos();
    limpiarFormulario();
    alert("Médico modificado con éxito");
}


function eliminarMedico(id) {
    const medicos = obtenerMedicos();
    const medico = medicos.find((m) => m.id === id);
    if (!medico) return;

    if (confirm(`¿Eliminar al Dr./Dra. ${medico.apellidoNombre}?`)) {
        const actualizados = medicos.filter((m) => m.id !== id);
        guardarMedicosEnStorage(actualizados);
        cargarMedicos();
        alert("Médico eliminado.");
    }
}

function editarMedico(id) {
    const medico = obtenerMedicos().find((m) => m.id === id);
    if (!medico) return;

    const partes = medico.apellidoNombre.split(" ");
    apellidoInput.value = partes.pop();
    nombreInput.value = partes.join(" ");
    matriculaInput.value = medico.matricula;
    especialidadInput.value = medico.especialidad;

    document.querySelectorAll("#obraSocialContainer input[type=checkbox]").forEach(cbox => {
        cbox.checked = medico.obrasSociales?.includes(cbox.value) || false;
    });

    valorConsultaInput.value = medico.honorarios;
    descripcionInput.value = medico.bio;
    medicoIdInput.value = medico.id;

    tituloFormulario.textContent = "Editar Médico";
    btnGuardarMedico.textContent = "Actualizar Médico";
    btnCancelarEdicion.style.display = "inline-block";

    window.scrollTo({ top: 0, behavior: "smooth" });

}

function limpiarFormulario() {
    formMedico.reset();
    medicoIdInput.value = "";
    fotoMedicoInput.value = "";
    tituloFormulario.textContent = "Agregar Nuevo Médico";
    btnGuardarMedico.textContent = "Guardar Médico";
    btnCancelarEdicion.style.display = "none";
}

function cargarMedicos() {
    const tbody = document.querySelector("#tablaMedicos tbody");
    const medicos = obtenerMedicos();

    tbody.innerHTML = medicos.length
        ? medicos
            .map(
                (m) => `
    <tr>
        <td><img src="${m.foto}" alt="${m.apellidoNombre}" class="rounded" style="width:50px;height:50px;object-fit:cover;"></td>
        <td>${m.id}</td>
        <td>${m.apellidoNombre}</td>
        <td>${m.matricula}</td>
        <td>${m.especialidad}</td>
        <td>${m.obrasSociales?.join(", ") || "N/A"}</td>
        <td>$${m.honorarios.toLocaleString("es-AR")}</td>
        <td class="text-end">
            <button class="btn btn-warning btn-sm me-1" onclick="editarMedico(${m.id})" title="Editar"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-danger btn-sm me-1" onclick="eliminarMedico(${m.id})" title="Eliminar"><i class="bi bi-trash"></i></button>
        </td>
    </tr>`
            )
            .join("")
        : `<tr><td colspan="8" class="text-center">No hay médicos registrados.</td></tr>`;
}

// ==================== VARIABLES GLOBALES ====================

let formMedico, medicoIdInput, matriculaInput, nombreInput, apellidoInput;
let especialidadInput, obraSocialInput, valorConsultaInput, descripcionInput;
let btnGuardarMedico, btnCancelarEdicion, tituloFormulario;
let fotoMedicoInput;


// ==================== DATOS DE OBRAS SOCIALES ====================

const obrasSocialesDelStorage = JSON.parse(localStorage.getItem("obrasSociales")) || [];

const obrasSocialesDisponibles = obrasSocialesDelStorage.length > 0
    ? obrasSocialesDelStorage
    : [
        { id: 1, nombre: "OSDE" },
        { id: 2, nombre: "Swiss Medical" },
        { id: 3, nombre: "Galeno" },
        { id: 4, nombre: "Medifé" },
        { id: 5, nombre: "PAMI" },
        { id: 6, nombre: "OMINT" }
    ];


// ==================== INICIALIZACIÓN DEL DOM ====================

document.addEventListener("DOMContentLoaded", () => {
    formMedico = document.getElementById("formMedico");
    medicoIdInput = document.getElementById("medicoId");
    matriculaInput = document.getElementById("matricula");
    fotoMedicoInput = document.getElementById("fotoMedico");
    nombreInput = document.getElementById("nombre");
    apellidoInput = document.getElementById("apellido");
    especialidadInput = document.getElementById("especialidad");
    obraSocialInput = document.getElementById("obraSocial");
    valorConsultaInput = document.getElementById("valorConsulta");
    descripcionInput = document.getElementById("descripcion");
    btnGuardarMedico = document.getElementById("btnGuardarMedico");
    btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
    tituloFormulario = document.getElementById("tituloFormulario");


    const obraSocialContainer = document.getElementById("obraSocialContainer");

    obrasSocialesDisponibles.forEach(os => {
        const div = document.createElement("div");
        div.classList.add("form-check");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.classList.add("form-check-input");
        input.id = `obraSocial-${os.id}`;
        input.value = os.nombre;

        const label = document.createElement("label");
        label.classList.add("form-check-label");
        label.htmlFor = input.id;
        label.textContent = os.nombre;

        div.appendChild(input);
        div.appendChild(label);
        obraSocialContainer.appendChild(div);
    });


    formMedico.addEventListener("submit", (e) => {
        e.preventDefault();
        guardarMedico();
    });

    btnCancelarEdicion.addEventListener("click", limpiarFormulario);

    cargarMedicos();
});

// ==================== FUNCIONES GLOBALES PARA BOTONES ====================

window.eliminarMedico = eliminarMedico;
window.editarMedico = editarMedico;
