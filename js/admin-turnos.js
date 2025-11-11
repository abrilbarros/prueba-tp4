import { restringir } from "./herramientas.js";
restringir();

// =============== Helpers de LocalStorage ===============
function leerMedicos() {
    try { return JSON.parse(localStorage.getItem("medicos")) || []; }
    catch { return []; }
}
function leerTurnos() {
    try { return JSON.parse(localStorage.getItem("turnos")) || []; }
    catch { return []; }
}
function guardarTurnos(lista) {
    localStorage.setItem("turnos", JSON.stringify(lista || []));
}
function leerAgenda() {
    try { return JSON.parse(localStorage.getItem("agenda")) || []; }
    catch { return []; }
}
function guardarAgenda(lista) {
    localStorage.setItem("agenda", JSON.stringify(lista || []));
}

// =============== Utilidades ===============
const HORAS_MEDIA = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00"
];

function nombreMedicoPorId(id) {
    const m = leerMedicos().find(x => Number(x.id) === Number(id));
    return m?.apellidoNombre || `ID ${id}`;
}

// =============== DOM ===============
document.addEventListener("DOMContentLoaded", () => {
    // refs
    const selFiltroMedico = document.getElementById("filtroMedico");

    const formAgenda = document.getElementById("formAgenda");
    const selAgendaMedico = document.getElementById("agendaMedico");
    const inpAgendaFecha = document.getElementById("agendaFecha");
    const selAgendaHoras = document.getElementById("agendaHoras");
    const divHorasCargadas = document.getElementById("listaHorasCargadas");

    const cuerpoTabla = document.getElementById("tablaTurnos");

    // =============== Cargar opciones de horas (multi) ===============
    function cargarListaHoras(horasGuardadas = []) {
        selAgendaHoras.innerHTML = "";
        const setGuardadas = new Set(horasGuardadas);
        HORAS_MEDIA.forEach(hora => {
            const op = document.createElement("option");
            op.value = hora;
            op.textContent = hora;
            if (setGuardadas.has(hora)) op.selected = true; // marca las ya guardadas (si las hay)
            selAgendaHoras.appendChild(op);
        });
    }

    // =============== Cargar selectores de médicos y horarios ===============
    function cargarMedicosSelect() {
        const medicos = leerMedicos();

        // filtro principal (arriba)
        selFiltroMedico.innerHTML = `<option value="">Todos</option>`;
        medicos.forEach(m => {
            const op = document.createElement("option");
            op.value = m.id;
            op.textContent = m.apellidoNombre || `Médico ${m.id}`;
            selFiltroMedico.appendChild(op);
        });

        // selector del formulario de agenda
        selAgendaMedico.innerHTML = `<option value="">Elegí un médico</option>`;
        medicos.forEach(m => {
            const op = document.createElement("option");
            op.value = m.id;
            op.textContent = m.apellidoNombre || `Médico ${m.id}`;
            selAgendaMedico.appendChild(op);
        });
    }

    // =============== Agenda ===============
    function obtenerHorasDeAgenda(medicoId, fecha) {
        const item = leerAgenda().find(x => Number(x.medicoId) === Number(medicoId) && x.fecha === fecha);
        return item?.horas || [];
    }

    function actualizarHorasAgenda(medicoId, fecha, horasSeleccionadas) {
        const agenda = leerAgenda();
        const indiceAgenda = agenda.findIndex(
            x => Number(x.medicoId) === Number(medicoId) && x.fecha === fecha
        );
        const listaHoras = Array.from(new Set(horasSeleccionadas)).sort(); // sin duplicados, ordenadas

        if (indiceAgenda >= 0) {
            agenda[indiceAgenda].horas = listaHoras;
        } else {
            agenda.push({ medicoId: Number(medicoId), fecha, horas: listaHoras });
        }
        guardarAgenda(agenda);
    }

    function mostrarHorasDeAgenda() {
        divHorasCargadas.innerHTML = "";
        const medicoId = selAgendaMedico.value;
        const fecha = inpAgendaFecha.value;

        if (!medicoId || !fecha) {
            cargarListaHoras([]);
            return;
        }

        const horasGuardadas = obtenerHorasDeAgenda(medicoId, fecha);

        // refresca el select y marca lo ya guardado
        cargarListaHoras(horasGuardadas);

        if (!horasGuardadas.length) {
            divHorasCargadas.innerHTML = `<span class="text-body-secondary">No hay horas cargadas.</span>`;
            return;
        }

        horasGuardadas.forEach(hora => {
            const badge = document.createElement("span");
            badge.className = "badge text-bg-light border";
            badge.textContent = hora;
            divHorasCargadas.appendChild(badge);
        });
    }

    // =============== Render de Turnos ===============
    function renderTurnos() {
        const turnos = leerTurnos();
        const filtroMed = selFiltroMedico.value;

        const lista = turnos.filter(t =>
            filtroMed ? Number(t.medicoId) === Number(filtroMed) : true
        );

        cuerpoTabla.innerHTML = lista.length ? "" :
            `<tr><td colspan="9" class="text-center">No hay registros.</td></tr>`;

        lista.forEach(t => {
            const tr = document.createElement("tr");
            const nombreMed = nombreMedicoPorId(t.medicoId);
            const monto = typeof t.precioFinal === "number" ? `$ ${t.precioFinal.toLocaleString("es-AR")}` : "-";
            const estado = t.estado || "confirmado";

            const acciones = [];
            if (estado === "confirmado") {
                acciones.push(
                    `<button class="btn btn-outline-success btn-sm me-1" data-accion="atendido" data-id="${t.id}">Atendido</button>`
                );
                acciones.push(
                    `<button class="btn btn-danger btn-sm" data-accion="cancelar" data-id="${t.id}">Cancelar</button>`
                );
            }

            tr.innerHTML = `
        <td>${t.id}</td>
        <td>${t.fecha}</td>
        <td>${t.hora}</td>
        <td>${nombreMed}</td>
        <td>${`${t.nombre}<br>${t.apellido}` || "-"}</td>
        <td>${t.obraSocialNombre || "Particular"}</td>
        <td>${monto}</td>
        <td>${estado}</td>
        <td class="text-end">${acciones.join(" ")}</td>
      `;
            cuerpoTabla.appendChild(tr);
        });
    }

    // =============== Eventos tabla turnos ===============
    cuerpoTabla.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-accion]");
        if (!btn) return;

        const id = Number(btn.dataset.id);
        const accion = btn.dataset.accion;

        const turnos = leerTurnos();
        const indiceTurno = turnos.findIndex(t => Number(t.id) === id);
        if (indiceTurno < 0) return;

        if (accion === "cancelar") {
            if (confirm("¿Cancelar este turno?")) {
                turnos[indiceTurno].estado = "cancelado";
            }
        }

        if (accion === "atendido") {
            if (turnos[indiceTurno].estado !== "cancelado") {
                turnos[indiceTurno].estado = "atendido";
            }
        }

        guardarTurnos(turnos);
        renderTurnos();
    });

    // =============== Eventos filtros / agenda ===============
    selFiltroMedico.addEventListener("change", renderTurnos);

    selAgendaMedico.addEventListener("change", mostrarHorasDeAgenda);
    inpAgendaFecha.addEventListener("change", mostrarHorasDeAgenda);

    formAgenda.addEventListener("submit", (e) => {
        e.preventDefault();
        const medicoId = selAgendaMedico.value;
        const fecha = inpAgendaFecha.value;

        if (!medicoId || !fecha) {
            alert("Elegí un médico y una fecha.");
            return;
        }

        const horasSeleccionadas = Array.from(selAgendaHoras.selectedOptions).map(o => o.value);
        if (!horasSeleccionadas.length) {
            alert("Seleccioná al menos una hora.");
            return;
        }

        actualizarHorasAgenda(medicoId, fecha, horasSeleccionadas);
        mostrarHorasDeAgenda();
        alert("Horarios guardados.");
    });

    // =============== Init ===============
    cargarListaHoras();
    cargarMedicosSelect();
    renderTurnos();
    mostrarHorasDeAgenda();
});