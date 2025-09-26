const pacientesRepo = require("../data/pacientes.repository");
const { makeId } = require("../lib/ids");

function crearPaciente(data) {
  if (!data || !data.nombre) {
    throw new Error("El nombre es obligatorio");
  }
  const paciente = {
    id: makeId("PAC"),
    nombre: data.nombre,
    fechaNac: data.fechaNac || null,
    genero: data.genero || null,
    contacto: data.contacto || null,
    estado: "Activo",
    creadoTs: Date.now(),
  };
  pacientesRepo.guardarPaciente(paciente);
  return paciente;
}

function listarPacientes() {
  return pacientesRepo.obtenerPacientes();
}

function obtenerPacientePorId(id) {
  const p = pacientesRepo.obtenerPacientes().find((x) => x.id === id);
  if (!p) throw new Error("Paciente no encontrado");
  return p;
}

module.exports = { crearPaciente, listarPacientes, obtenerPacientePorId };
