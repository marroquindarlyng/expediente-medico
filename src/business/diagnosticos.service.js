const diagnosticosRepo = require("../data/diagnosticos.repository");
const consultasRepo = require("../data/consultas.repository");
const { DIAGNOSTICOS } = require("../catalogos/diagnosticos");
const { EVENTOS } = require("../catalogos/eventos");
const eventosService = require("./eventos.service");

function listarCatalogo() {
  return DIAGNOSTICOS;
}

function registrarDiagnostico(data) {
  if (!data.consultaId || !data.diaId) {
    throw new Error("consultaId y diaId son obligatorios");
  }

  const consulta = consultasRepo
    .obtenerConsultas()
    .find((c) => c.id === data.consultaId);
  if (!consulta) throw new Error("Consulta no encontrada");

  const diagCatalogo = DIAGNOSTICOS.find((d) => d.id === data.diaId);
  if (!diagCatalogo) throw new Error("Código de diagnóstico no válido");

  const diagnostico = {
    consultaId: data.consultaId,
    diaId: data.diaId,
    observaciones: data.observaciones || "",
    ts: Date.now(),
  };

  diagnosticosRepo.guardarDiagnostico(diagnostico);
  eventosService.registrarEvento(EVENTOS.DIAGNOSTICO_REG, data.consultaId);
  return diagnostico;
}

function listarDiagnosticos() {
  return diagnosticosRepo.obtenerDiagnosticos();
}

module.exports = { listarCatalogo, registrarDiagnostico, listarDiagnosticos };
