// src/presentation/citas.routes.js
const express = require("express");
const pool = require("../data/db"); // conexión a MySQL
const router = express.Router();

// GET: listar todas las citas con paciente, médico y especialidad
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.fecha, c.hora, c.estado,
             p.nombre AS paciente,
             m.nombre AS medico,
             e.esp_nombre AS especialidad
      FROM citas c
      JOIN pacientes p ON c.paciente_id = p.id
      JOIN medicos m ON c.medico_id = m.id
      JOIN especialidades e ON m.especialidad_id = e.id
      ORDER BY c.fecha, c.hora
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener citas:", err);
    res.status(500).json({ mensaje: "Error interno", error: err.message });
  }
});

// GET: obtener una cita por id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT c.id, c.fecha, c.hora, c.estado,
             p.nombre AS paciente,
             m.nombre AS medico,
             e.esp_nombre AS especialidad
      FROM citas c
      JOIN pacientes p ON c.paciente_id = p.id
      JOIN medicos m ON c.medico_id = m.id
      JOIN especialidades e ON m.especialidad_id = e.id
      WHERE c.id = ?
    `,
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ mensaje: "Cita no encontrada" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener cita:", err);
    res.status(500).json({ mensaje: "Error interno", error: err.message });
  }
});

module.exports = router;
