// src/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar rutas desde la capa presentation
const pacientesRoutes = require("./src/presentation/pacientes.routes");
const medicosRoutes = require("./src/presentation/medicos.routes");
const citasRoutes = require("./src/presentation/citas.routes");
const recetasRoutes = require("./src/presentation/recetas.routes");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas base
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/medicos", medicosRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/recetas", recetasRoutes);

// Puerto desde .env o por defecto 3001
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 API CoreHealth escuchando en http://localhost:${port}`);
});

app.get("/api/test-env", (req, res) => {
  res.json({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
  });
});
