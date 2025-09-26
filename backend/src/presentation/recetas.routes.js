const express = require("express");
const router = express.Router();
const recetasService = require("../business/recetas.service");

// Catálogo de medicamentos
router.get("/catalogo", (req, res) => {
  res.json(recetasService.listarCatalogo());
});

// Emitir receta
router.post("/", (req, res) => {
  try {
    const nueva = recetasService.emitirReceta(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar recetas emitidas
router.get("/", (req, res) => {
  res.json(recetasService.listarRecetas());
});

module.exports = router;
