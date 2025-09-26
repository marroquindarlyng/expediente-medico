const { readDB, writeDB } = require("../lib/store");

function obtenerDiagnosticos() {
  const db = readDB();
  return db.diagnosticos || [];
}

function guardarDiagnostico(diagnostico) {
  const db = readDB();
  if (!db.diagnosticos) db.diagnosticos = [];
  db.diagnosticos.push(diagnostico);
  writeDB(db);
}

module.exports = { obtenerDiagnosticos, guardarDiagnostico };
