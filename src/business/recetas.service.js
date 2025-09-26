const recetasRepo = require("../data/recetas.repository");
const consultasRepo = require("../data/consultas.repository");
const { MEDICAMENTOS } = require("../catalogos/medicamentos");
const { EVENTOS } = require("../catalogos/eventos");
const eventosService = require("./eventos.service");

function listarCatalogo() {
  return MEDICAMENTOS;
}

function emitirReceta(data) {
  if (!data.consultaId || !data.mediId) {
    throw new Error("consultaId y mediId son obligatorios");
  }

  const consulta = consultasRepo
    .obtenerConsultas()
    .find((c) => c.id === data.consultaId);
  if (!consulta) throw new Error("Consulta no encontrada");

  const medicamento = MEDICAMENTOS.find((m) => m.id === data.mediId);
  if (!medicamento) throw new Error("Código de medicamento no válido");

  const receta = {
    consultaId: data.consultaId,
    mediId: data.mediId,
    dosis: data.dosis || medicamento.dosisEstandar,
    duracion: data.duracion || "",
    observaciones: data.observaciones || "",
    ts: Date.now(),
  };

  recetasRepo.guardarReceta(receta);
  eventosService.registrarEvento(EVENTOS.RECETA_EMITIDA, data.consultaId);

  return receta;
}

function listarRecetas() {
  return recetasRepo.obtenerRecetas();
}

module.exports = { listarCatalogo, emitirReceta, listarRecetas };
