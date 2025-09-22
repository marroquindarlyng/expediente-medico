const express = require("express");
const router = express.Router();
const citasService = require("../business/citas.service");

// Agendar cita
router.post("/", (req, res) => {
  try {
    const nueva = citasService.agendarCita(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar citas
router.get("/", (req, res) => {
  res.json(citasService.listarCitas());
});

// Obtener cita por ID
router.get("/:id", (req, res) => {
  try {
    res.json(citasService.obtenerCitaPorId(req.params.id));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Confirmar cita
router.patch("/:id/confirmar", (req, res) => {
  try {
    res.json(citasService.confirmarCita(req.params.id));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Cancelar cita
router.delete("/:id", (req, res) => {
  try {
    res.json(citasService.cancelarCita(req.params.id));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;
