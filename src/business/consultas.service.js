const consultasRepo = require("../data/consultas.repository");
const citasRepo = require("../data/citas.repository");
const { makeId } = require("../lib/ids");
const { EVENTOS } = require("../catalogos/eventos");
const eventosService = require("./eventos.service");

function registrarConsulta(data) {
  if (!data.citaId) throw new Error("citaId es obligatorio");

  const citas = citasRepo.obtenerCitas();
  const cita = citas.find((c) => c.id === data.citaId);
  if (!cita) throw new Error("Cita no encontrada");

  const consulta = {
    id: makeId("CONS"),
    citaId: data.citaId,
    motivo: data.motivo || "",
    observaciones: data.observaciones || "",
    ts: Date.now(),
  };

  consultasRepo.guardarConsulta(consulta);

  // Actualizar estado de la cita
  citasRepo.actualizarCita(data.citaId, { estado: "Completada" });
  eventosService.registrarEvento(EVENTOS.CITA_COMPLETADA, data.citaId);

  return consulta;
}

function listarConsultas() {
  return consultasRepo.obtenerConsultas();
}

module.exports = { registrarConsulta, listarConsultas };
