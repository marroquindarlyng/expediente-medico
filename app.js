// app.js (backend)
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Servir archivos estáticos (tus HTML, CSS y JS en /public)
app.use(express.static(path.join(__dirname, "public")));

// Importar rutas desde /presentation
const pacientesRouter = require("./presentation/pacientes.routes");
const citasRouter = require("./presentation/citas.routes");
const consultasRouter = require("./presentation/consultas.routes");
const diagnosticosRouter = require("./presentation/diagnosticos.routes");
const eventosRouter = require("./presentation/eventos.routes");
const medicamentosRouter = require("./presentation/medicamentos.routes");
const recetasRouter = require("./presentation/recetas.routes");
const vistasRouter = require("./presentation/vistas.routes");
const auditoriaRouter = require("./presentation/auditoria.routes");

// Usar rutas con prefijo /api
app.use("/api/pacientes", pacientesRouter);
app.use("/api/citas", citasRouter);
app.use("/api/consultas", consultasRouter);
app.use("/api/diagnosticos", diagnosticosRouter);
app.use("/api/eventos", eventosRouter);
app.use("/api/medicamentos", medicamentosRouter);
app.use("/api/recetas", recetasRouter);
app.use("/api/vistas", vistasRouter);
app.use("/api/auditoria", auditoriaRouter);

const diagnosticosRouter = require("./presentation/diagnosticos.routes");
const medicamentosRouter = require("./presentation/medicamentos.routes");
const recetasRouter = require("./presentation/recetas.routes");
const eventosRouter = require("./presentation/eventos.routes");
const vistasRouter = require("./presentation/vistas.routes");
const auditoriaRouter = require("./presentation/auditoria.routes");

app.use("/api/diagnosticos", diagnosticosRouter);
app.use("/api/medicamentos", medicamentosRouter);
app.use("/api/recetas", recetasRouter);
app.use("/api/eventos", eventosRouter);
app.use("/api/vistas", vistasRouter);
app.use("/api/auditoria", auditoriaRouter);

// Exportar la app (para que server.js la arranque)
module.exports = app;
