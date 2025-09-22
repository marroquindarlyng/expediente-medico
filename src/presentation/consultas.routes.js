const express = require("express");
const router = express.Router();
const consultasService = require("../business/consultas.service");

// Registrar consulta
router.post("/", (req, res) => {
  try {
    const nueva = consultasService.registrarConsulta(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar consultas
router.get("/", (req, res) => {
  res.json(consultasService.listarConsultas());
});

module.exports = router;
