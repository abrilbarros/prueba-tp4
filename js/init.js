import {
    MEDICOS_SEED,
    ESPECIALIDADES_SEED,
    OBRAS_SOCIALES_SEED,
    AGENDA_SEED,
    TURNOS_SEED
} from "./seed.js";

export function inicializarDatos() {
    try {
        if (!localStorage.getItem("especialidades")) {
            localStorage.setItem("especialidades", JSON.stringify(ESPECIALIDADES_SEED));
        }
        if (!localStorage.getItem("obrasSociales")) {
            localStorage.setItem("obrasSociales", JSON.stringify(OBRAS_SOCIALES_SEED));
        }
        if (!localStorage.getItem("medicos")) {
            localStorage.setItem("medicos", JSON.stringify(MEDICOS_SEED));
        }
        if (!localStorage.getItem("agenda")) {
            localStorage.setItem("agenda", JSON.stringify(AGENDA_SEED));
        }
        if (!localStorage.getItem("turnos")) {
            localStorage.setItem("turnos", JSON.stringify(TURNOS_SEED));
        }
    } catch (e) {
        console.error("Error inicializando datos:", e);
    }
};