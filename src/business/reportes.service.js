const citasRepo = require("../data/citas.repository");
const diagnosticosRepo = require("../data/diagnosticos.repository");
const recetasRepo = require("../data/recetas.repository");

function citasPorEstado() {
  const citas = citasRepo.obtenerCitas();
  const conteo = {};
  citas.forEach((c) => {
    conteo[c.estado] = (conteo[c.estado] || 0) + 1;
  });
  return conteo;
}

function diagnosticosFrecuentes() {
  const diagnosticos = diagnosticosRepo.obtenerDiagnosticos();
  const conteo = {};
  diagnosticos.forEach((d) => {
    conteo[d.diaId] = (conteo[d.diaId] || 0) + 1;
  });
  return Object.entries(conteo)
    .map(([diaId, total]) => ({ diaId, total }))
    .sort((a, b) => b.total - a.total);
}

function medicamentosFrecuentes() {
  const recetas = recetasRepo.obtenerRecetas();
  const conteo = {};
  recetas.forEach((r) => {
    conteo[r.mediId] = (conteo[r.mediId] || 0) + 1;
  });
  return Object.entries(conteo)
    .map(([mediId, total]) => ({ mediId, total }))
    .sort((a, b) => b.total - a.total);
}

module.exports = {
  citasPorEstado,
  diagnosticosFrecuentes,
  medicamentosFrecuentes,
};
