const express = require("express");
const router = express.Router();
const eventosService = require("../business/eventos.service");

router.get("/", (req, res) => {
  res.json(eventosService.listarEventos());
});

module.exports = router;
