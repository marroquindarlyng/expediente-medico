// 1) Importar dependencias
const express = require("express");
const app = express();

// 2) Middlewares base
app.use(express.json());

// 3) Rutas (capa presentación)
const pacientesRoutes = require("./src/presentation/pacientes.routes");
app.use("/api/pacientes", pacientesRoutes);

const citasRoutes = require("./src/presentation/citas.routes");
app.use("/api/citas", citasRoutes);

// 4) Ruta de salud
app.get("/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// 5) Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.use(express.static("public"));

const consultasRoutes = require("./src/presentation/consultas.routes");
app.use("/api/consultas", consultasRoutes);

const diagnosticosRoutes = require("./src/presentation/diagnosticos.routes");
app.use("/api/diagnosticos", diagnosticosRoutes);

const recetasRoutes = require("./src/presentation/recetas.routes");
app.use("/api/recetas", recetasRoutes);

const eventosRoutes = require("./src/presentation/eventos.routes");
app.use("/api/eventos", eventosRoutes);

const auditoriaRoutes = require("./src/presentation/auditoria.routes");
app.use("/api/auditoria", auditoriaRoutes);

const reportesRoutes = require("./src/presentation/reportes.routes");
app.use("/api/reportes", reportesRoutes);

const vistasRoutes = require("./src/presentation/vistas.routes");
app.use("/api/vistas", vistasRoutes);
