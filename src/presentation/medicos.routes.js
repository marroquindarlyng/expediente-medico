// src/presentation/medicos.routes.js
const express = require("express");
const pool = require("../data/db"); // conexión a MySQL
const router = express.Router();

// GET: listar médicos con su especialidad
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.id, m.usuario, m.nombre, m.email, m.activo,
             e.esp_nombre AS especialidad
      FROM medicos m
      JOIN especialidades e ON m.especialidad_id = e.id
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener médicos:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
});

// GET: médico por id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT m.id, m.usuario, m.nombre, m.email, m.activo,
             e.esp_nombre AS especialidad
      FROM medicos m
      JOIN especialidades e ON m.especialidad_id = e.id
      WHERE m.id = ?
    `,
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ mensaje: "Médico no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener médico:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
});

module.exports = router;
