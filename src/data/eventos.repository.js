const { readDB, writeDB } = require("../lib/store");

function obtenerEventos() {
  const db = readDB();
  return db.eventos || [];
}

function guardarEvento(evento) {
  const db = readDB();
  if (!db.eventos) db.eventos = [];
  db.eventos.push(evento);
  writeDB(db);
}

module.exports = { obtenerEventos, guardarEvento };
