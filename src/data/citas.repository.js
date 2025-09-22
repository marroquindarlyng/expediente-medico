const { readDB, writeDB } = require("../lib/store");

function obtenerCitas() {
  const db = readDB();
  return db.citas || [];
}

function guardarCita(cita) {
  const db = readDB();
  if (!db.citas) db.citas = [];
  db.citas.push(cita);
  writeDB(db);
}

function actualizarCita(id, cambios) {
  const db = readDB();
  const index = db.citas.findIndex((c) => c.id === id);
  if (index === -1) return null;
  db.citas[index] = { ...db.citas[index], ...cambios };
  writeDB(db);
  return db.citas[index];
}

function eliminarCita(id) {
  const db = readDB();
  const index = db.citas.findIndex((c) => c.id === id);
  if (index === -1) return false;
  db.citas.splice(index, 1);
  writeDB(db);
  return true;
}

module.exports = { obtenerCitas, guardarCita, actualizarCita, eliminarCita };
