const express = require("express");
const router = express.Router();
const auditoriaService = require("../business/auditoria.service");

// Auditoría por cita
router.get("/cita/:id", (req, res) => {
  res.json(auditoriaService.auditoriaPorCita(req.params.id));
});

// Auditoría por paciente
router.get("/paciente/:id", (req, res) => {
  res.json(auditoriaService.auditoriaPorPaciente(req.params.id));
});

module.exports = router;
