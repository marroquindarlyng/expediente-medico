const pool = require("../data/db");

// Listar pacientes
exports.getPacientes = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pacientes");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener pacientes" });
  }
};

// Crear paciente
exports.createPaciente = async (req, res) => {
  try {
    const { usuario, nombre, email, activo } = req.body;
    const [result] = await pool.query(
      "INSERT INTO pacientes (usuario, nombre, email, activo) VALUES (?, ?, ?, ?)",
      [usuario, nombre, email, activo]
    );
    res.json({ id: result.insertId, usuario, nombre, email, activo });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al crear paciente" });
  }
};

// Actualizar paciente
exports.updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, nombre, email, activo } = req.body;
    await pool.query(
      "UPDATE pacientes SET usuario=?, nombre=?, email=?, activo=? WHERE id=?",
      [usuario, nombre, email, activo, id]
    );
    res.json({ mensaje: "Paciente actualizado" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar paciente" });
  }
};

// Eliminar paciente
exports.deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM pacientes WHERE id=?", [id]);
    res.json({ mensaje: "Paciente eliminado" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar paciente" });
  }
};
