// presentation/pacientes.routes.js
const express = require("express");
const pool = require("../data/db"); // ajusta la ruta según dónde tengas db.js
const router = express.Router();

// GET: listar pacientes
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, usuario, nombre, email, activo FROM pacientes"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener pacientes:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
});

module.exports = router;
