// ==================== Datos y estado ====================
const KEY = 'medicos';
const LIMITE = 3;
let expandido = false;

// ==================== Referencias al DOM ====================
const grilla = document.getElementById('staffGrid');
const buscador = document.getElementById('busqueda');
const filtroEspecialidad = document.getElementById('filtroEspecialidad');

// ==================== Acceso a LocalStorage ====================
function leerMedicos() {
  try {
    const jsonAlmacenado = localStorage.getItem(KEY);
    const medicos = jsonAlmacenado ? JSON.parse(jsonAlmacenado) : [];
    return Array.isArray(medicos) ? medicos : [];
  } catch {
    return [];
  }
}

function leerEspecialidades() {
  try {
    const jsonEspecialidades = localStorage.getItem('especialidades');
    const lista = jsonEspecialidades ? JSON.parse(jsonEspecialidades) : [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

// ==================== Búsqueda/filtrado ====================
function filtrar() {
  const texto = (buscador?.value || '').trim().toLowerCase();
  const esp = filtroEspecialidad?.value || '';
  return leerMedicos().filter(medico => {
    const nombre = (medico.apellidoNombre || '').toLowerCase();
    const especialidad = (medico.especialidad || '').toLowerCase();
    const coincideTexto = !texto || nombre.includes(texto) || especialidad.includes(texto);
    const coincideEsp = !esp || medico.especialidad === esp;
    return coincideTexto && coincideEsp;
  });
}

// ==================== Botón Ver más / Ver menos ====================
function botonVerMas(mostrar, estado) {
  let contenedor = document.getElementById('contenedorVerMas');
  if (!mostrar) { if (contenedor) contenedor.classList.add('d-none'); return; }

  if (!contenedor) {
    grilla.insertAdjacentHTML(
      'afterend',
      '<div id="contenedorVerMas" class="d-grid justify-content-center mt-3"></div>'
    );
    contenedor = document.getElementById('contenedorVerMas');
  }
  contenedor.classList.remove('d-none');

  let boton = document.getElementById('btnVerMas');
  if (!boton) {
    contenedor.innerHTML =
      '<button id="btnVerMas" class="btn btn-outline-primary border-2 rounded-pill fw-semibold px-4">Ver más</button>';
    boton = document.getElementById('btnVerMas');
    boton.addEventListener('click', () => {
      expandido = !expandido;
      actualizarListado();
      grilla.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  boton.textContent = estado ? 'Ver menos' : 'Ver más';
}

// ==================== Render de la grilla ====================
function actualizarListado() {
  if (!grilla) return;

  const medicos = filtrar();
  if (medicos.length === 0) {
    grilla.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center mb-0">No encontramos profesionales con esos criterios.</div>
      </div>`;
    botonVerMas(false, false);
    return;
  }

  const visibles = expandido ? medicos : medicos.slice(0, LIMITE);
  grilla.innerHTML = visibles.map(medico => {
    const foto = medico.foto || 'img/doctor-placeholder.png';
    const nombre = medico.apellidoNombre || 'Profesional';
    const especialidad = medico.especialidad || '';
    const matricula = medico.matricula ? ` · ${medico.matricula}` : '';
    const bio = medico.bio ? `<p class="card-text small mb-3">${medico.bio}</p>` : '';
    const honorarios = Number(medico.honorarios || 0).toLocaleString('es-AR');
    const obras = Array.isArray(medico.obrasSociales) ? medico.obrasSociales : [];
    const etiquetasObras = obras.map(o => `<span class="badge bg-light text-dark border">${o}</span>`).join(' ');

    return `
      <div class="col-12 col-sm-6 col-md-4">
        <article class="card h-100 shadow-sm">
          <img class="card-img-top" src="${foto}" alt="${nombre}"
              onerror="this.onerror=null;this.src='img/doctor-placeholder.png'">
          <div class="card-body">
            <h3 class="h6 card-title mb-1">${nombre}</h3>
            <p class="text-body-secondary mb-2">${especialidad}${matricula}</p>
            ${bio}
            ${etiquetasObras ? `<div class="d-flex flex-wrap gap-1">${etiquetasObras}</div>` : ''}
          </div>
          <div class="card-footer bg-white">
            <strong>$ ${honorarios}</strong>
          </div>
        </article>
      </div>`;
  }).join('');

  botonVerMas(medicos.length > LIMITE, expandido);
}

// ==================== Select de especialidades ====================
function cargarEspecialidades() {
  if (!filtroEspecialidad) return;
  filtroEspecialidad.innerHTML = '<option value="">Todas las especialidades</option>';
  leerEspecialidades().forEach(e => {
    const nombre = typeof e === 'string' ? e : (e?.nombre || '');
    if (!nombre) return;
    const opcion = document.createElement('option');
    opcion.value = nombre;
    opcion.textContent = nombre;
    filtroEspecialidad.appendChild(opcion);
  });
}

// ==================== Inicialización ====================
document.addEventListener('DOMContentLoaded', () => {
  cargarEspecialidades();
  expandido = false;
  actualizarListado();
  buscador?.addEventListener('input', () => { expandido = false; actualizarListado(); });
  filtroEspecialidad?.addEventListener('change', () => { expandido = false; actualizarListado(); });
});