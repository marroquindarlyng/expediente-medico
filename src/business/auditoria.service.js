const eventosRepo = require("../data/eventos.repository");
const citasRepo = require("../data/citas.repository");
const consultasRepo = require("../data/consultas.repository");

function auditoriaPorCita(citaId) {
  const eventos = eventosRepo
    .obtenerEventos()
    .filter((e) => e.referencia === citaId)
    .sort((a, b) => a.ts - b.ts);
  return eventos;
}

function auditoriaPorPaciente(pacienteId) {
  const citas = citasRepo
    .obtenerCitas()
    .filter((c) => c.pacienteId === pacienteId);
  const consultas = consultasRepo
    .obtenerConsultas()
    .filter((cons) => citas.some((c) => c.id === cons.citaId));

  const idsReferencias = [
    ...citas.map((c) => c.id),
    ...consultas.map((cons) => cons.id),
  ];

  const eventos = eventosRepo
    .obtenerEventos()
    .filter((e) => idsReferencias.includes(e.referencia))
    .sort((a, b) => a.ts - b.ts);

  return eventos;
}

module.exports = { auditoriaPorCita, auditoriaPorPaciente };
