import { restringir } from "./herramientas.js";
restringir();
// ===== helpers locales =====
function leerObrasSociales() {
    try { return JSON.parse(localStorage.getItem("obrasSociales")) || []; }
    catch { return []; }
}
function guardarObrasSociales(lista) {
    localStorage.setItem("obrasSociales", JSON.stringify(lista || []));
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formObraSocial");
    const inpNombre = document.getElementById("obraNombre");
    const inpDescripcion = document.getElementById("obraDescripcion");
    const inpCobertura = document.getElementById("obraCobertura");
    const cuerpo = document.getElementById("tablaObrasSociales");

    function render() {
        const lista = leerObrasSociales();
        cuerpo.innerHTML = lista.length ? "" : `<tr><td colspan="4" class="text-center">No hay obras sociales cargadas.</td></tr>`;
        lista.forEach((o, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${o.nombre}</td>
        <td>${o.descripcion || "-"}</td>
        <td>${Number(o.porcentajeCobertura)}%</td>
        <td class="text-end">
          <button class="btn btn-warning btn-sm me-1" data-accion="editar" data-index="${i}">Editar</button>
          <button class="btn btn-danger btn-sm" data-accion="eliminar" data-index="${i}">Eliminar</button>
        </td>`;
            cuerpo.appendChild(tr);
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = inpNombre.value.trim();
        const descripcion = inpDescripcion.value.trim();
        const porcentajeCobertura = Number(inpCobertura.value);
        if (!nombre || isNaN(porcentajeCobertura) || porcentajeCobertura < 0 || porcentajeCobertura > 100) {
            alert("Completá un nombre y una cobertura válida entre 0 y 100.");
            return;
        }
        const lista = leerObrasSociales();
        const existe = lista.findIndex(x => (x.nombre || "").toLowerCase() === nombre.toLowerCase());
        if (existe >= 0) {
            lista[existe].descripcion = descripcion;
            lista[existe].porcentajeCobertura = porcentajeCobertura;
        } else {
            const ids = lista.map(x => x.id).filter(n => typeof n === "number" && !isNaN(n));
            const nuevoId = ids.length ? Math.max(...ids) + 1 : 1;
            lista.push({ id: nuevoId, nombre, descripcion, porcentajeCobertura });
        }
        guardarObrasSociales(lista);
        form.reset();
        render();
    });

    cuerpo.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-accion]");
        if (!btn) return;
        const idx = Number(btn.dataset.index);
        const lista = leerObrasSociales();
        const accion = btn.dataset.accion;

        if (accion === "eliminar") {
            if (confirm("¿Eliminar obra social?")) {
                lista.splice(idx, 1);
                guardarObrasSociales(lista);
                render();
            }
        } else if (accion === "editar") {
            const item = lista[idx];
            inpNombre.value = item.nombre;
            inpDescripcion.value = item.descripcion || "";
            inpCobertura.value = item.porcentajeCobertura;
            window.scrollTo(0, 0);
        }
    });

    render();
});