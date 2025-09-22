const { readDB, writeDB } = require("../lib/store");

function obtenerPacientes() {
  const db = readDB();
  return db.pacientes;
}

function guardarPaciente(paciente) {
  const db = readDB();
  db.pacientes.push(paciente);
  writeDB(db);
}

module.exports = { obtenerPacientes, guardarPaciente };
