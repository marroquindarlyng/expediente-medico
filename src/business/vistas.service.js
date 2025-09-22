const pacientesRepo = require("../data/pacientes.repository");
const citasRepo = require("../data/citas.repository");
const consultasRepo = require("../data/consultas.repository");
const diagnosticosRepo = require("../data/diagnosticos.repository");
const recetasRepo = require("../data/recetas.repository");
const { DIAGNOSTICOS } = require("../catalogos/diagnosticos");
const { MEDICAMENTOS } = require("../catalogos/medicamentos");

function vistaCitasDetalladas() {
  const pacientes = pacientesRepo.obtenerPacientes();
  const citas = citasRepo.obtenerCitas();

  return citas.map((c) => {
    const paciente = pacientes.find((p) => p.id === c.pacienteId);
    return {
      ...c,
      pacienteNombre: paciente ? paciente.nombre : "Desconocido",
      pacienteContacto: paciente ? paciente.contacto : "",
    };
  });
}

function vistaConsultasDetalladas() {
  const citas = citasRepo.obtenerCitas();
  const consultas = consultasRepo.obtenerConsultas();
  const diagnosticos = diagnosticosRepo.obtenerDiagnosticos();
  const recetas = recetasRepo.obtenerRecetas();

  return consultas.map((cons) => {
    const cita = citas.find((c) => c.id === cons.citaId);
    const diag = diagnosticos
      .filter((d) => d.consultaId === cons.id)
      .map((d) => {
        const info = DIAGNOSTICOS.find((cat) => cat.id === d.diaId);
        return { ...d, descripcion: info ? info.descripcion : "" };
      });
    const recs = recetas
      .filter((r) => r.consultaId === cons.id)
      .map((r) => {
        const info = MEDICAMENTOS.find((cat) => cat.id === r.mediId);
        return { ...r, nombre: info ? info.nombre : "" };
      });

    return {
      ...cons,
      citaFecha: cita ? cita.fecha : "",
      citaHora: cita ? cita.hora : "",
      diagnosticos: diag,
      recetas: recs,
    };
  });
}

module.exports = { vistaCitasDetalladas, vistaConsultasDetalladas };
