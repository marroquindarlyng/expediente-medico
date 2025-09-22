const { readDB, writeDB } = require("../lib/store");

function obtenerRecetas() {
  const db = readDB();
  return db.recetas || [];
}

function guardarReceta(receta) {
  const db = readDB();
  if (!db.recetas) db.recetas = [];
  db.recetas.push(receta);
  writeDB(db);
}

module.exports = { obtenerRecetas, guardarReceta };
