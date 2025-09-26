const eventosRepo = require("../data/eventos.repository");

function registrarEvento(evtId, referencia) {
  const evento = {
    evtId,
    referencia, // puede ser citaId, consultaId, etc.
    ts: Date.now(),
  };
  eventosRepo.guardarEvento(evento);
  return evento;
}

function listarEventos() {
  return eventosRepo.obtenerEventos();
}

module.exports = { registrarEvento, listarEventos };
