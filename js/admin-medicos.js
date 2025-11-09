const rol = sessionStorage.getItem("rolUsuario");

//Solo si el usuario es Administrador ingresa
if (rol !== "admin") {
    alert("Acceso denegado. Redirigiendo a la página principal.");
    window.location.href = "index.html"
};

const STORAGE_KEY = "medicos";
// ==================== PERSISTENCIA ====================

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

// ==================== CRUD ====================

async function guardarMedico() {
    const id = medicoIdInput.value;
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const matricula = matriculaInput.value.trim();
    const especialidad = especialidadInput.value.trim();
    const obraSocial = obraSocialInput.value;
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
        obrasSociales: obraSocial.split(',').map(os => os.trim()),
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
    obraSocialInput.value = medico.obrasSociales?.join(", ") || "";
    valorConsultaInput.value = medico.honorarios;
    descripcionInput.value = medico.bio;
    medicoIdInput.value = medico.id;

    tituloFormulario.textContent = "Editar Médico";
    btnGuardarMedico.textContent = "Actualizar Médico";
    btnCancelarEdicion.style.display = "inline-block";
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
          <button class="btn btn-warning btn-sm me-1" onclick="editarMedico(${m.id})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${m.id})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`
            )
            .join("")
        : `<tr><td colspan="8" class="text-center">No hay médicos registrados.</td></tr>`;
}

// ==================== INICIALIZACIÓN ====================

let formMedico, medicoIdInput, matriculaInput, nombreInput, apellidoInput;
let especialidadInput, obraSocialInput, valorConsultaInput, descripcionInput;
let btnGuardarMedico, btnCancelarEdicion, tituloFormulario;
let fotoMedicoInput;

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

    formMedico.addEventListener("submit", (e) => {
        e.preventDefault();
        guardarMedico();
    });

    btnCancelarEdicion.addEventListener("click", limpiarFormulario);

    cargarMedicos();
});

window.eliminarMedico = eliminarMedico;
window.editarMedico = editarMedico;
