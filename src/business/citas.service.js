const citasRepo = require("../data/citas.repository");
const { makeId } = require("../lib/ids");
const { EVENTOS } = require("../catalogos/eventos");
const eventosService = require("./eventos.service");

function agendarCita(data) {
  if (!data.pacienteId || !data.fecha || !data.hora) {
    throw new Error("pacienteId, fecha y hora son obligatorios");
  }
  const cita = {
    id: makeId("CITA"),
    pacienteId: data.pacienteId,
    fecha: data.fecha,
    hora: data.hora,
    estado: "Agendada",
    creadoTs: Date.now(),
  };
  citasRepo.guardarCita(cita);
  eventosService.registrarEvento(EVENTOS.CITA_AGENDADA, cita.id);
  return cita;
}

function listarCitas() {
  return citasRepo.obtenerCitas();
}

function obtenerCitaPorId(id) {
  const cita = citasRepo.obtenerCitas().find((c) => c.id === id);
  if (!cita) throw new Error("Cita no encontrada");
  return cita;
}

function confirmarCita(id) {
  const cita = citasRepo.actualizarCita(id, { estado: "Confirmada" });
  eventosService.registrarEvento(EVENTOS.CITA_CONFIRMADA, id);
  if (!cita) throw new Error("Cita no encontrada");
  return cita;
}

function cancelarCita(id) {
  const ok = citasRepo.eliminarCita(id);
  eventosService.registrarEvento(EVENTOS.CITA_CANCELADA_MED, id);
  if (!ok) throw new Error("Cita no encontrada");
  return { mensaje: "Cita cancelada" };
}

module.exports = {
  agendarCita,
  listarCitas,
  obtenerCitaPorId,
  confirmarCita,
  cancelarCita,
};
