const express = require("express");
const router = express.Router();
const diagnosticosService = require("../business/diagnosticos.service");

// Catálogo de diagnósticos
router.get("/catalogo", (req, res) => {
  res.json(diagnosticosService.listarCatalogo());
});

// Registrar diagnóstico
router.post("/", (req, res) => {
  try {
    const nuevo = diagnosticosService.registrarDiagnostico(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar diagnósticos registrados
router.get("/", (req, res) => {
  res.json(diagnosticosService.listarDiagnosticos());
});

module.exports = router;
