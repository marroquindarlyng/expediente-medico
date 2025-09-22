const express = require("express");
const router = express.Router();
const pacientesService = require("../business/pacientes.service");

// Crear paciente
router.post("/", (req, res) => {
  try {
    const nuevo = pacientesService.crearPaciente(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar pacientes
router.get("/", (req, res) => {
  const lista = pacientesService.listarPacientes();
  res.json(lista);
});

// Obtener paciente por ID
router.get("/:id", (req, res) => {
  try {
    const pac = pacientesService.obtenerPacientePorId(req.params.id);
    res.json(pac);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;
