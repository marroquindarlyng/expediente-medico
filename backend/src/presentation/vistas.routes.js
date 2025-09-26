const express = require("express");
const router = express.Router();
const vistasService = require("../business/vistas.service");

router.get("/citas-detalladas", (req, res) => {
  res.json(vistasService.vistaCitasDetalladas());
});

router.get("/consultas-detalladas", (req, res) => {
  res.json(vistasService.vistaConsultasDetalladas());
});

module.exports = router;
