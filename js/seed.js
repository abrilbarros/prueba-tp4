// Especialidades
export const ESPECIALIDADES_SEED = [
    { id: 1, nombre: "Clínica Médica" },
    { id: 2, nombre: "Pediatría" },
    { id: 3, nombre: "Cirugía General" },
    { id: 4, nombre: "Cardiología" },
    { id: 5, nombre: "Dermatologia" },
    { id: 6, nombre: "Traumatologia" },
    { id: 7, nombre: "Ginecología y Obstetricia" },
    { id: 8, nombre: "Neurología" }
];

// Obras Sociales
export const OBRAS_SOCIALES_SEED = [
    { id: 1, nombre: "OSDE", descripcion: "Obra Social de Ejecutivos", porcentajeCobertura: 80 },
    { id: 2, nombre: "Swiss Medical", descripcion: "Swiss Medical Group", porcentajeCobertura: 75 },
    { id: 3, nombre: "Galeno", descripcion: "Compañía de Seguros Galeno", porcentajeCobertura: 70 },
    { id: 4, nombre: "Medifé", descripcion: "Medicina Integral Familiar y Empresarial", porcentajeCobertura: 65 },
    { id: 5, nombre: "OMINT", descripcion: "Obra Social del Instituto Médico", porcentajeCobertura: 85 },
    { id: 6, nombre: "PAMI", descripcion: "Programa de Atención Médica Integral", porcentajeCobertura: 90 }
];

// Médicos
export const MEDICOS_SEED = [
    {
        id: 1,
        apellidoNombre: "Dra. Valentina Ríos Fernández",
        matricula: "MN-21543",
        especialidad: "Clínica Médica",
        email: "valentina.rios@vita.com",
        telefono: "+54 11 5252-1101",
        honorarios: 28000,
        obrasSociales: ["OSDE", "PAMI", "Medifé"],
        bio: "Clínica médica con enfoque en prevención y control de enfermedades crónicas. Atención integral del adulto.",
        foto: "img/valentinariosfernandez.png"
    },
    {
        id: 2,
        apellidoNombre: "Dr. Mateo López Fernández",
        matricula: "MP-90432",
        especialidad: "Pediatría",
        email: "mateo.lopez@vita.com",
        telefono: "+54 11 5252-1102",
        honorarios: 30000,
        obrasSociales: ["Swiss Medical", "OSDE", "Galeno"],
        bio: "Pediatra con foco en control del niño, vacunación y seguimiento del desarrollo.",
        foto: "img/mateolopezfernandez.png"
    },
    {
        id: 3,
        apellidoNombre: "Dra. Camila Duarte Herrera",
        matricula: "MN-34781",
        especialidad: "Cirugía General",
        email: "camila.duarte@vita.com",
        telefono: "+54 11 5252-1103",
        honorarios: 38000,
        obrasSociales: ["OMINT", "OSDE", "Swiss Medical"],
        bio: "Cirugía general y laparoscópica. Manejo pre y postoperatorio orientado a la recuperación rápida.",
        foto: "img/camiladuarteherrera.png"
    },
    {
        id: 4,
        apellidoNombre: "Dra. María José Barrera",
        matricula: "MP-77210",
        especialidad: "Pediatría",
        email: "mariajose.barrera@vita.com",
        telefono: "+54 11 5252-1104",
        honorarios: 29500,
        obrasSociales: ["PAMI", "Medifé", "Galeno"],
        bio: "Pediatría ambulatoria. Alimentación saludable, crecimiento y educación para la salud en la familia.",
        foto: "img/mariajosebarrera.png"
    }
];

// Agenda (horarios disponibles por médico y fecha)
export const AGENDA_SEED = [
    { medicoId: 1, fecha: "2025-11-12", horas: ["09:00", "09:30", "10:00", "10:30", "11:00"] },
    { medicoId: 2, fecha: "2025-11-12", horas: ["14:00", "14:30", "15:00", "15:30"] },
    { medicoId: 3, fecha: "2025-11-13", horas: ["08:00", "08:30", "09:00"] }
];

// Turnos (uno ocupado de ejemplo)
export const TURNOS_SEED = [
    {
        id: 1,
        medicoId: 1,
        fecha: "2025-11-12",
        hora: "09:30",
        cliente: "Ejemplo",
        obraSocialNombre: "OSDE",
        precioBase: 28000,
        precioFinal: 5600,
        estado: "confirmada"
    }
];