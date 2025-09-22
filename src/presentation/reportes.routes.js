const express = require("express");
const router = express.Router();
const reportesService = require("../business/reportes.service");

router.get("/citas-por-estado", (req, res) => {
  res.json(reportesService.citasPorEstado());
});

router.get("/diagnosticos-frecuentes", (req, res) => {
  res.json(reportesService.diagnosticosFrecuentes());
});

router.get("/medicamentos-frecuentes", (req, res) => {
  res.json(reportesService.medicamentosFrecuentes());
});

module.exports = router;
