const { readDB, writeDB } = require("../lib/store");

function obtenerConsultas() {
  const db = readDB();
  return db.consultas || [];
}

function guardarConsulta(consulta) {
  const db = readDB();
  if (!db.consultas) db.consultas = [];
  db.consultas.push(consulta);
  writeDB(db);
}

module.exports = { obtenerConsultas, guardarConsulta };
