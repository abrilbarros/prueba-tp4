// ===== Helpers de almacenamiento =====
function leerUsuarioLogueado(){
    try { return JSON.parse(sessionStorage.getItem("usuario")) || null;} catch { return [];}
}
function leerEspecialidades() {
    try { return JSON.parse(localStorage.getItem("especialidades")) || []; } catch { return []; }
}
function leerMedicos() {
    try { return JSON.parse(localStorage.getItem("medicos")) || []; } catch { return []; }
}
function leerObrasSociales() {
    try { return JSON.parse(localStorage.getItem("obrasSociales")) || []; } catch { return []; }
}
function leerTurnos() {
    try { return JSON.parse(localStorage.getItem("turnos")) || []; } catch { return []; }
}
function guardarTurnos(lista) {
    localStorage.setItem("turnos", JSON.stringify(lista || []));
}
function leerAgenda() {
    try { return JSON.parse(localStorage.getItem("agenda")) || []; } catch { return []; }
}

// ===== Helpers de dominio =====
function buscarMedicoPorId(id) {
    return leerMedicos().find(m => Number(m.id) === Number(id));
}
function buscarObraPorNombre(nombre) {
    return leerObrasSociales().find(
        o => (o.nombre || "").toLowerCase() === (nombre || "").toLowerCase()
    );
}
function obtenerHorasDisponibles(medicoId, fecha) {
    const item = leerAgenda().find(x => Number(x.medicoId) === Number(medicoId) && x.fecha === fecha);
    return item?.horas || [];
}
function estaOcupado(medicoId, fecha, hora) {
    return leerTurnos().some(
        t => Number(t.medicoId) === Number(medicoId) && t.fecha === fecha && t.hora === hora && t.estado !== "cancelada"
    );
}
function calcularCopago(precioBase, porcentajeCobertura) {
    const cobertura = Math.round(Number(precioBase) * (Number(porcentajeCobertura) / 100));
    const copago = Math.max(0, Number(precioBase) - cobertura);
    return { coberturaAplicada: cobertura, montoFinalPaciente: copago };
}

function logueado() {
    const usuario = leerUsuarioLogueado();
    const inputNombre = document.getElementById("nombre");
    const inputApellido = document.getElementById("apellido");
    const misTurnos = document.getElementById("misTurnos")

    if (usuario && usuario.nombre && usuario.apellido) {
        inputNombre.value = usuario.nombre;
        inputApellido.value = usuario.apellido;
        inputNombre.setAttribute("readonly", true);
        inputApellido.setAttribute("readonly", true);
        misTurnos.classList.remove("d-none");
    } else {
        inputNombre.value = "";
        inputApellido.value = "";
        inputNombre.removeAttribute("readonly");
        inputApellido.removeAttribute("readonly");
        misTurnos.classList.add("d-none");
    }
}


document.addEventListener("DOMContentLoaded", () => {
    logueado()
    // ===== Referencias =====
    const selEspecialidad = document.getElementById("selectEspecialidad");
    const selMed = document.getElementById("selectMedico");
    const selObra = document.getElementById("selectObra");
    const infoDesc = document.getElementById("infoDescuento");
    const inpFecha = document.getElementById("inputFecha");
    const contHoras = document.getElementById("contenedorHoras");

    // Resumen
    const resCont = document.getElementById("resumen");
    const resMed = document.getElementById("resumenMedico");
    const resFec = document.getElementById("resumenFecha");
    const resHor = document.getElementById("resumenHora");
    const resObr = document.getElementById("resumenObra");
    const resDes = document.getElementById("resumenDescuento");
    const resMon = document.getElementById("resumenMonto");
    const btnConfirmar = document.getElementById("btnConfirmar");

    // Mis turnos (tabla del usuario simulado)
    const tbodyTablaMisTurnos = document.getElementById("tablaMisTurnos");

    // Estado temporal de selección
    let seleccion = { medicoId: null, fecha: null, hora: null, obraSocialNombre: "", montoFinal: 0 };

    // ===== Carga de selects =====
    function cargarEspecialidades() {
        if (!selEspecialidad) return;
        selEspecialidad.innerHTML = `<option value="">Todas</option>`;
        const lista = leerEspecialidades();
        lista.forEach(e => {
            const nombre = typeof e === "string" ? e : (e?.nombre || "");
            if (!nombre) return;
            const op = document.createElement("option");
            op.value = nombre;
            op.textContent = nombre;
            selEspecialidad.appendChild(op);
        });
    }

    function cargarMedicos() {
        const filtro = (selEspecialidad?.value || "").toLowerCase();
        const medicos = leerMedicos().filter(m =>
            (m.especialidad || "").toLowerCase().includes(filtro)
        );

        selMed.innerHTML = `<option value="">Elegí un médico</option>`;
        medicos.forEach(m => {
            const opt = document.createElement("option");
            opt.value = m.id;
            opt.textContent = m.apellidoNombre || `Médico ${m.id}`;
            selMed.appendChild(opt);
        });

        // Reset dependientes
        selObra.innerHTML = "";
        infoDesc.textContent = "";
        contHoras.innerHTML = "";
        resCont.style.display = "none";
    }

    function cargarObrasDelMedico(medicoId) {
        const medico = buscarMedicoPorId(medicoId);
        selObra.innerHTML = `<option value="">Particular</option>`;
        (medico?.obrasSociales || []).forEach(nombre => {
            const opt = document.createElement("option");
            opt.value = nombre;
            opt.textContent = nombre;
            selObra.appendChild(opt);
        });
        infoDesc.textContent = "";
    }

    // ===== Horarios disponibles + selección =====
    function renderHoras() {
        contHoras.innerHTML = "";
        resCont.style.display = "none";

        const medicoId = selMed.value;
        const fecha = inpFecha.value;
        if (!medicoId || !fecha) return;

        const horasDisponibles = obtenerHorasDisponibles(medicoId, fecha);

        if (!horasDisponibles.length) {
            contHoras.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning mb-0">No hay horarios disponibles para esa fecha.</div>
        </div>`;
            return;
        }

        const horasOcupadas = leerTurnos()
            .filter(t => Number(t.medicoId) === Number(medicoId) && t.fecha === fecha && t.estado !== "cancelada")
            .map(t => t.hora);

        horasDisponibles.forEach(hhmm => {
            const ocupado = horasOcupadas.includes(hhmm);
            const col = document.createElement("div");
            col.className = "col-6 col-md-3 col-lg-2";

            const btn = document.createElement("button");
            btn.className = `btn w-100 mb-2 ${ocupado ? "btn-outline-secondary" : "btn-success"}`;
            btn.textContent = hhmm;
            btn.disabled = ocupado;
            if (!ocupado) btn.addEventListener("click", () => elegirHora(hhmm));

            col.appendChild(btn);
            contHoras.appendChild(col);
        });
    }

    function elegirHora(hhmm) {
        const medicoId = selMed.value;
        const fecha = inpFecha.value;
        const obraNombre = selObra.value || ""; // "" = Particular

        const medico = buscarMedicoPorId(medicoId);
        if (!medico) return;

        const precioBase = Number(medico.honorarios || medico.valorConsulta || 0);
        const obra = obraNombre ? buscarObraPorNombre(obraNombre) : null;
        const coberturaPorc = obra ? Number(obra.porcentajeCobertura) : 0;
        const { coberturaAplicada, montoFinalPaciente } = calcularCopago(precioBase, coberturaPorc);

        const especialidad = medico.especialidad || "";
        resMed.textContent = especialidad
            ? `${medico.apellidoNombre} – ${especialidad}`
            : (medico.apellidoNombre || `Médico ${medico.id}`);
        resFec.textContent = fecha;
        resHor.textContent = hhmm;
        resObr.textContent = obra ? obra.nombre : "Particular";
        resDes.textContent = obra ? ` (cobertura ${coberturaPorc}%, cubre $${coberturaAplicada.toLocaleString("es-AR")})` : "";
        resMon.textContent = montoFinalPaciente.toLocaleString("es-AR");

        seleccion = { medicoId: Number(medicoId), fecha, hora: hhmm, obraSocialNombre: obra ? obra.nombre : "", montoFinal: montoFinalPaciente };
        resCont.style.display = "block";
    }

    // ===== Confirmación de turno =====
    btnConfirmar?.addEventListener("click", () => {
        const { medicoId, fecha, hora } = seleccion;
        if (!medicoId || !fecha || !hora) { alert("Completá los datos del turno."); return; }
        if (estaOcupado(medicoId, fecha, hora)) { alert("Ese horario ya no está disponible."); renderHoras(); return; }

        const turnos = leerTurnos();
        const medico = buscarMedicoPorId(medicoId);
        const inputNombre = document.getElementById("nombre")
        const inputApellido = document.getElementById("apellido")

        const nuevo = {
            id: (turnos.map(t => t.id).filter(n => typeof n === "number" && !isNaN(n)).sort((a, b) => b - a)[0] || 0) + 1,
            medicoId,
            fecha,
            hora,
            nombre: inputNombre.value,
            apellido: inputApellido.value,
            obraSocialNombre: seleccion.obraSocialNombre || "Particular",
            precioBase: Number(medico.honorarios || medico.valorConsulta || 0),
            precioFinal: seleccion.montoFinal,
            estado: "confirmado"
        };
        turnos.push(nuevo);
        guardarTurnos(turnos);

        alert("Turno reservado con éxito.");
        renderHoras();       // refresca disponibilidad
        resCont.style.display = "none";
        renderMisTurnos();   // actualiza la tabla del usuario
    });

    // ===== "Mis turnos" (Avery Perez) =====
    function renderMisTurnos() {
        if (!tbodyTablaMisTurnos) return;

        const usuario = leerUsuarioLogueado();
        const turnos = usuario
            ?leerTurnos().filter(t => t.nombre === usuario.nombre && t.apellido === usuario.apellido && t.estado !== "cancelado")
            :[]
        const medicos = leerMedicos();

        if(usuario){
            tbodyTablaMisTurnos.innerHTML = turnos.length
                ? ""
                : `<tr><td colspan="6" class="text-center">No tenés turnos reservados.</td></tr>`;
        }

        turnos.forEach(t => {
            const med = medicos.find(m => Number(m.id) === Number(t.medicoId));
            const nombreMed = med?.apellidoNombre || `Médico ${t.medicoId}`;
            const monto = typeof t.precioFinal === "number"
                ? `$ ${t.precioFinal.toLocaleString("es-AR")}`
                : "-";
            const btnTurno = t.estado === "cancelada"
                ? ""
                : `<button class="btn btn-sm btn-outline-danger" data-cancelar="${t.id}">Cancelar</button>`;
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${t.fecha}</td>
        <td>${t.hora}</td>
        <td>${nombreMed}</td>
        <td>${t.obraSocialNombre || "Particular"}</td>
        <td>${monto}</td>
        <td>${t.estado}</td>
        <td class="text-end">
          ${btnTurno}
        </td>`;
            tbodyTablaMisTurnos.appendChild(tr);
        });
    }

    // Delegación para cancelar turnos del usuario
    tbodyTablaMisTurnos?.addEventListener("click", (e) => {
        const usuario = leerUsuarioLogueado()
        const btn = e.target.closest("button[data-cancelar]");
        if (!btn) return;
        const id = Number(btn.dataset.cancelar);
        const turnos = leerTurnos();
        const i = turnos.findIndex(t => Number(t.id) === id && t.nombre === usuario.nombre && t.apellido === usuario.apellido);
        if (i < 0) return;

        if (!confirm("¿Querés cancelar este turno?")) return;
        turnos[i].estado = "cancelada";
        guardarTurnos(turnos);
        renderMisTurnos();
        renderHoras();
    });

    // ===== Listeners e inicialización =====
    selEspecialidad?.addEventListener("change", cargarMedicos);
    selMed.addEventListener("change", () => { cargarObrasDelMedico(selMed.value); renderHoras(); });
    selObra.addEventListener("change", () => {
        const obra = selObra.value ? buscarObraPorNombre(selObra.value) : null;
        infoDesc.textContent = obra ? `Cobertura disponible: ${obra.porcentajeCobertura}%` : "";
        if (resHor.textContent) elegirHora(resHor.textContent);
    });
    inpFecha.addEventListener("change", renderHoras);

    cargarEspecialidades();
    cargarMedicos();
    renderMisTurnos();
});