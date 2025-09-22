// Detectar si estamos en la vista del doctor o del paciente
const isDoctor = document.title.includes("Doctor");
const isPaciente = document.title.includes("Paciente");

document.addEventListener("DOMContentLoaded", () => {
  if (isDoctor) {
    // Solo se ejecuta en doctor.html
    if (document.getElementById("tablaCitas")) cargarCitasTable(true);
    if (document.getElementById("tablaConsultas")) cargarConsultasTable(true);
    if (document.getElementById("selectPacientes")) cargarPacientesSelect();
    if (document.getElementById("selectCitas")) cargarCitasSelect();
    if (
      document.getElementById("selectConsultasDiag") ||
      document.getElementById("selectConsultasRec")
    ) {
      cargarConsultasSelect();
    }
    if (document.getElementById("selectDiagnosticos"))
      cargarDiagnosticosSelect();
    if (document.getElementById("selectMedicamentos"))
      cargarMedicamentosSelect();
  }

  if (isPaciente) {
    // Solo se ejecuta en paciente.html
    if (document.getElementById("tablaCitas")) {
      // Si el backend ya filtra por paciente
      cargarMisCitasTable();
    }
    if (document.getElementById("tablaRecetas")) {
      cargarRecetasPaciente();
    }

    async function cargarMisCitasTable() {
      const res = await fetch("/api/vistas/mis-citas");
      state.citas.data = await res.json();
      renderCitasTable();
    }

    async function cargarRecetasPaciente() {
      const res = await fetch("/api/vistas/mis-recetas");
      state.recetas.data = await res.json();
      renderRecetasTable();
    }
  }
});

// ===============================
// ESTADO GLOBAL DE TABLAS
// ===============================
const state = {
  citas: {
    data: [],
    filtered: [],
    page: 1,
    pageSize: 10,
    sortKey: "fecha",
    sortDir: "asc", // 'asc' | 'desc'
    filterText: "",
  },
  consultas: {
    data: [],
    filtered: [],
    page: 1,
    pageSize: 10,
    sortKey: "citaFecha",
    sortDir: "asc",
    filterText: "",
  },
};

// ===============================
// UTILES: ORDENAMIENTO Y PAGINACIÓN
// ===============================
function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  // Intento: si parecen fecha/hora, comparar por string normalizado
  const as = String(a).toLowerCase();
  const bs = String(b).toLowerCase();
  if (as < bs) return 1 * -1;
  if (as > bs) return 1 * 1;
  return 0;
}

function sortData(arr, key, dir) {
  const sorted = [...arr].sort((x, y) => compareValues(x[key], y[key]));
  return dir === "asc" ? sorted : sorted.reverse();
}

function paginate(arr, page, pageSize) {
  const total = arr.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  return {
    page: safePage,
    total,
    totalPages,
    slice: arr.slice(start, end),
  };
}

function setHeaderSortIndicator(tableId, sortKey, sortDir) {
  const ths = document.querySelectorAll(`${tableId} thead th`);
  ths.forEach((th) => {
    const key = th.getAttribute("data-sort");
    if (!key) {
      th.textContent = th.textContent; // no-op para celdas sin sort
      return;
    }
    const base = th.textContent.replace(/[\u25B2\u25BC]\s*$/, "").trim();
    if (key === sortKey) {
      th.textContent = `${base} ${sortDir === "asc" ? "▲" : "▼"}`;
    } else {
      th.textContent = base;
    }
  });
}

// ===============================
// CARGA DE DATOS BASE (API vistas)
// ===============================
async function fetchCitasDetalladas() {
  const res = await fetch("/api/vistas/citas-detalladas");
  return res.json();
}

async function fetchConsultasDetalladas() {
  const res = await fetch("/api/vistas/consultas-detalladas");
  return res.json();
}

// ===============================
// RENDER DE TABLA: CITAS
// ===============================
async function cargarCitasTable(reload = false) {
  if (reload || state.citas.data.length === 0) {
    state.citas.data = await fetchCitasDetalladas();
  }

  // filtro
  let rows = state.citas.data;
  const f = state.citas.filterText.trim().toLowerCase();
  if (f) {
    rows = rows.filter(
      (c) =>
        (c.pacienteNombre || "").toLowerCase().includes(f) ||
        (c.fecha || "").toLowerCase().includes(f) ||
        (c.estado || "").toLowerCase().includes(f)
    );
  }

  // orden
  rows = sortData(rows, state.citas.sortKey, state.citas.sortDir);
  state.citas.filtered = rows;

  // paginar
  const { page, total, totalPages, slice } = paginate(
    rows,
    state.citas.page,
    state.citas.pageSize
  );
  state.citas.page = page;

  // pintar
  const tbody = document.querySelector("#tablaCitas tbody");
  tbody.innerHTML = "";
  slice.forEach((c) => {
    tbody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.pacienteNombre}</td>
        <td>${c.pacienteContacto}</td>
        <td>${c.fecha}</td>
        <td>${c.hora}</td>
        <td>${c.estado}</td>
      </tr>
    `;
  });

  // info de página
  document.getElementById(
    "citasPageInfo"
  ).textContent = `Página ${page} de ${totalPages}`;
  document.getElementById("citasPrev").disabled = page <= 1;
  document.getElementById("citasNext").disabled = page >= totalPages;

  // indicador sort
  setHeaderSortIndicator(
    "#tablaCitas",
    state.citas.sortKey,
    state.citas.sortDir
  );
}

// ===============================
// RENDER DE TABLA: CONSULTAS
// ===============================
async function cargarConsultasTable(reload = false) {
  if (reload || state.consultas.data.length === 0) {
    state.consultas.data = await fetchConsultasDetalladas();
  }

  // filtro
  let rows = state.consultas.data;
  const f = state.consultas.filterText.trim().toLowerCase();
  if (f) {
    rows = rows.filter(
      (cons) =>
        (cons.motivo || "").toLowerCase().includes(f) ||
        (cons.diagnosticos || []).some((d) =>
          (d.descripcion || "").toLowerCase().includes(f)
        ) ||
        (cons.recetas || []).some((r) =>
          (r.nombre || "").toLowerCase().includes(f)
        )
    );
  }

  // orden
  rows = sortData(rows, state.consultas.sortKey, state.consultas.sortDir);
  state.consultas.filtered = rows;

  // paginar
  const { page, total, totalPages, slice } = paginate(
    rows,
    state.consultas.page,
    state.consultas.pageSize
  );
  state.consultas.page = page;

  // pintar
  const tbody = document.querySelector("#tablaConsultas tbody");
  tbody.innerHTML = "";
  slice.forEach((cons) => {
    const diag =
      (cons.diagnosticos || []).map((d) => d.descripcion).join(", ") || "—";
    const recs = (cons.recetas || []).map((r) => r.nombre).join(", ") || "—";
    tbody.innerHTML += `
      <tr>
        <td>${cons.id}</td>
        <td>${cons.citaFecha}</td>
        <td>${cons.citaHora}</td>
        <td>${cons.motivo}</td>
        <td>${diag}</td>
        <td>${recs}</td>
      </tr>
    `;
  });

  // info de página
  document.getElementById(
    "consultasPageInfo"
  ).textContent = `Página ${page} de ${totalPages}`;
  document.getElementById("consultasPrev").disabled = page <= 1;
  document.getElementById("consultasNext").disabled = page >= totalPages;

  // indicador sort
  setHeaderSortIndicator(
    "#tablaConsultas",
    state.consultas.sortKey,
    state.consultas.sortDir
  );
}

// ===============================
// SELECTORES (ya existentes de pasos previos)
// ===============================
async function cargarPacientesSelect() {
  const res = await fetch("/api/pacientes");
  const pacientes = await res.json();
  const select = document.getElementById("selectPacientes");
  if (!select) return; // por si en tu HTML no está
  select.innerHTML = '<option value="">Seleccione paciente</option>';
  pacientes.forEach((p) => {
    select.innerHTML += `<option value="${p.id}">${p.nombre} (${p.contacto})</option>`;
  });
}

async function cargarCitasSelect() {
  const res = await fetch("/api/citas");
  const citas = await res.json();
  const select = document.getElementById("selectCitas");
  if (!select) return;
  select.innerHTML = '<option value="">Seleccione cita</option>';
  citas
    .filter((c) => c.estado === "Agendada" || c.estado === "Confirmada")
    .forEach((c) => {
      select.innerHTML += `<option value="${c.id}">${c.id} - ${c.fecha} ${c.hora}</option>`;
    });
}

async function cargarConsultasSelect() {
  const res = await fetch("/api/consultas");
  const consultas = await res.json();

  const selectDiag = document.getElementById("selectConsultasDiag");
  const selectRec = document.getElementById("selectConsultasRec");
  if (!selectDiag || !selectRec) return;

  selectDiag.innerHTML = '<option value="">Seleccione consulta</option>';
  selectRec.innerHTML = '<option value="">Seleccione consulta</option>';

  consultas.forEach((cons) => {
    const label = `${cons.id} - ${cons.motivo}`;
    selectDiag.innerHTML += `<option value="${cons.id}">${label}</option>`;
    selectRec.innerHTML += `<option value="${cons.id}">${label}</option>`;
  });
}

async function cargarDiagnosticosSelect() {
  const res = await fetch("/api/diagnosticos/catalogo");
  const catalogo = await res.json();
  const select = document.getElementById("selectDiagnosticos");
  if (!select) return;
  select.innerHTML = '<option value="">Seleccione diagnóstico</option>';
  catalogo.forEach((d) => {
    select.innerHTML += `<option value="${d.id}">${d.id} - ${d.descripcion}</option>`;
  });
}

async function cargarMedicamentosSelect() {
  const res = await fetch("/api/medicamentos/catalogo");
  const catalogo = await res.json();
  const select = document.getElementById("selectMedicamentos");
  if (!select) return;
  select.innerHTML = '<option value="">Seleccione medicamento</option>';
  catalogo.forEach((m) => {
    select.innerHTML += `<option value="${m.id}">${m.id} - ${m.nombre}</option>`;
  });
}

// ===============================
// FORMULARIOS (ya existentes de pasos previos)
// ===============================
const formPaciente = document.getElementById("formPaciente");
if (formPaciente) {
  formPaciente.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await fetch("/api/pacientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    e.target.reset();
    await cargarPacientesSelect();
    await cargarCitasSelect();
    state.citas.page = 1;
    await cargarCitasTable(true);
  });
}

const formCita = document.getElementById("formCita");
if (formCita) {
  formCita.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await fetch("/api/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    e.target.reset();
    await cargarCitasSelect();
    state.citas.page = 1;
    await cargarCitasTable(true);
  });
}

const formConsulta = document.getElementById("formConsulta");
if (formConsulta) {
  formConsulta.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await fetch("/api/consultas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    e.target.reset();
    await cargarConsultasSelect();
    state.consultas.page = 1;
    await cargarConsultasTable(true);
  });
}

const formDiagnostico = document.getElementById("formDiagnostico");
if (formDiagnostico) {
  formDiagnostico.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await fetch("/api/diagnosticos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    e.target.reset();
    await cargarConsultasTable(true);
  });
}

const formReceta = document.getElementById("formReceta");
if (formReceta) {
  formReceta.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await fetch("/api/recetas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    e.target.reset();
    await cargarConsultasTable(true);
  });
}

// ===============================
// BÚSQUEDA EN TIEMPO REAL
// ===============================
const buscarCitas = document.getElementById("buscarCitas");
if (buscarCitas) {
  buscarCitas.addEventListener("input", async (e) => {
    state.citas.filterText = e.target.value;
    state.citas.page = 1;
    await cargarCitasTable(false);
  });
}

const buscarConsultas = document.getElementById("buscarConsultas");
if (buscarConsultas) {
  buscarConsultas.addEventListener("input", async (e) => {
    state.consultas.filterText = e.target.value;
    state.consultas.page = 1;
    await cargarConsultasTable(false);
  });
}

// ===============================
// CONTROLES DE PAGINACIÓN
// ===============================
// Citas
const citasPrev = document.getElementById("citasPrev");
const citasNext = document.getElementById("citasNext");
const citasPageSize = document.getElementById("citasPageSize");

if (citasPrev && citasNext && citasPageSize) {
  citasPrev.addEventListener("click", async () => {
    state.citas.page = Math.max(1, state.citas.page - 1);
    await cargarCitasTable(false);
  });
  citasNext.addEventListener("click", async () => {
    state.citas.page += 1;
    await cargarCitasTable(false);
  });
  citasPageSize.addEventListener("change", async (e) => {
    state.citas.pageSize = parseInt(e.target.value, 10);
    state.citas.page = 1;
    await cargarCitasTable(false);
  });
}

// Consultas
const consultasPrev = document.getElementById("consultasPrev");
const consultasNext = document.getElementById("consultasNext");
const consultasPageSize = document.getElementById("consultasPageSize");

if (consultasPrev && consultasNext && consultasPageSize) {
  consultasPrev.addEventListener("click", async () => {
    state.consultas.page = Math.max(1, state.consultas.page - 1);
    await cargarConsultasTable(false);
  });
  consultasNext.addEventListener("click", async () => {
    state.consultas.page += 1;
    await cargarConsultasTable(false);
  });
  consultasPageSize.addEventListener("change", async (e) => {
    state.consultas.pageSize = parseInt(e.target.value, 10);
    state.consultas.page = 1;
    await cargarConsultasTable(false);
  });
}

// ===============================
// ORDENAMIENTO POR CLIC EN ENCABEZADOS
// ===============================
// Citas
document.querySelectorAll("#tablaCitas thead th[data-sort]").forEach((th) => {
  th.style.cursor = "pointer";
  th.addEventListener("click", async () => {
    const key = th.getAttribute("data-sort");
    if (state.citas.sortKey === key) {
      state.citas.sortDir = state.citas.sortDir === "asc" ? "desc" : "asc";
    } else {
      state.citas.sortKey = key;
      state.citas.sortDir = "asc";
    }
    state.citas.page = 1;
    await cargarCitasTable(false);
  });
});

// Consultas
document
  .querySelectorAll("#tablaConsultas thead th[data-sort]")
  .forEach((th) => {
    th.style.cursor = "pointer";
    th.addEventListener("click", async () => {
      const key = th.getAttribute("data-sort");
      if (state.consultas.sortKey === key) {
        state.consultas.sortDir =
          state.consultas.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.consultas.sortKey = key;
        state.consultas.sortDir = "asc";
      }
      state.consultas.page = 1;
      await cargarConsultasTable(false);
    });
  });

// ===============================
// CARGA INICIAL
// ===============================
(async function init() {
  // Selectores (si existen)
  await Promise.all([
    cargarPacientesSelect(),
    cargarCitasSelect(),
    cargarConsultasSelect(),
    cargarDiagnosticosSelect(),
    cargarMedicamentosSelect(),
  ]);

  // Tablas
  await cargarCitasTable(true);
  await cargarConsultasTable(true);
})();
