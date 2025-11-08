// ===== helpers locales =====
function leerMedicos() {
    try { return JSON.parse(localStorage.getItem("medicos")) || []; } catch { return []; }
}
function leerTurnos() {
    try { return JSON.parse(localStorage.getItem("turnos")) || []; } catch { return []; }
}
function guardarTurnos(lista) {
    localStorage.setItem("turnos", JSON.stringify(lista || []));
}

document.addEventListener("DOMContentLoaded", () => {
    const selMed = document.getElementById("filtroMedico");
    const cuerpo = document.getElementById("tablaTurnos");

    function cargarMedicosSelect() {
        const medicos = leerMedicos();
        selMed.innerHTML = `<option value="">Todos</option>`;
        medicos.forEach(m => {
            const opt = document.createElement("option");
            opt.value = m.id;
            opt.textContent = m.apellidoNombre || `Médico ${m.id}`;
            selMed.appendChild(opt);
        });
    }

    function render() {
        const turnos = leerTurnos();
        const medicos = leerMedicos();
        const filtroMed = selMed.value;

        const lista = turnos.filter(t =>
            filtroMed ? Number(t.medicoId) === Number(filtroMed) : true
        );

        cuerpo.innerHTML = lista.length
            ? ""
            : `<tr><td colspan="9" class="text-center">No hay registros.</td></tr>`;

        lista.forEach(t => {
            const med = medicos.find(m => Number(m.id) === Number(t.medicoId));
            const nombreMed = med?.apellidoNombre || `ID ${t.medicoId}`;
            const monto = typeof t.precioFinal === "number"
                ? `$ ${t.precioFinal.toLocaleString("es-AR")}`
                : "-";
            const estado = t.estado || "confirmada";

            // Reglas según estado
            const puedeAtender = estado === "confirmada";
            const puedeCancelar = estado === "confirmada";

            const btnAtendido = puedeAtender
                ? `<button class="btn btn-outline-success btn-sm me-1" data-accion="atendido" data-id="${t.id}">Atendido</button>`
                : "";

            const btnCancelar = puedeCancelar
                ? `<button class="btn btn-danger btn-sm" data-accion="cancelar" data-id="${t.id}">Cancelar</button>`
                : "";

            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${t.id}</td>
        <td>${t.fecha}</td>
        <td>${t.hora}</td>
        <td>${nombreMed}</td>
        <td>${t.cliente || "-"}</td>
        <td>${t.obraSocialNombre || "Particular"}</td>
        <td>${monto}</td>
        <td>${estado}</td>
        <td class="text-end">
          ${btnAtendido}${btnCancelar}
        </td>`;
            cuerpo.appendChild(tr);
        });
    }

    // Transiciones de estado protegidas
    cuerpo.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-accion]");
        if (!btn) return;

        const id = Number(btn.dataset.id);
        const accion = btn.dataset.accion;
        const turnos = leerTurnos();
        const idx = turnos.findIndex(t => Number(t.id) === id);
        if (idx < 0) return;

        const estadoActual = turnos[idx].estado || "confirmada";

        if (accion === "atendido") {
            if (estadoActual !== "confirmada") return;
            turnos[idx].estado = "atendido";
        }

        if (accion === "cancelar") {
            if (estadoActual !== "confirmada") return;
            if (!confirm("¿Cancelar este turno?")) return;
            turnos[idx].estado = "cancelada";
        }

        guardarTurnos(turnos);
        render();
    });

    selMed.addEventListener("change", render);

    cargarMedicosSelect();
    render();
});