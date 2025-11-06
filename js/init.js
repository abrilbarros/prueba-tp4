import { MEDICOS_SEED, ESPECIALIDADES_SEED, OBRAS_SOCIALES_SEED } from "./seed.js";

export function inicializarDatos() {
    // Inicializa LocalStorage de Especialidades si está vacío
    if (!localStorage.getItem("especialidades")) {
        localStorage.setItem("especialidades", JSON.stringify(ESPECIALIDADES_SEED));
    }
    if (!localStorage.getItem("obrasSociales")) {
        localStorage.setItem("obrasSociales", JSON.stringify(OBRAS_SOCIALES_SEED));
    }
    if (!localStorage.getItem("medicos")) {
        localStorage.setItem("medicos", JSON.stringify(MEDICOS_SEED));
    }
    }