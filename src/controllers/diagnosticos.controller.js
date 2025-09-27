const pool = require("../data/db");

exports.getConsultas = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM consultas");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener consultas" });
  }
};

exports.createConsulta = async (req, res) => {
  try {
    const { paciente_id, medico_id, fecha, descripcion } = req.body;
    const [result] = await pool.query(
      "INSERT INTO consultas (paciente_id, medico_id, fecha, descripcion) VALUES (?, ?, ?, ?)",
      [paciente_id, medico_id, fecha, descripcion]
    );
    res.json({
      id: result.insertId,
      paciente_id,
      medico_id,
      fecha,
      descripcion,
    });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al crear consulta" });
  }
};

exports.updateConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    const { paciente_id, medico_id, fecha, descripcion } = req.body;
    await pool.query(
      "UPDATE consultas SET paciente_id=?, medico_id=?, fecha=?, descripcion=? WHERE id=?",
      [paciente_id, medico_id, fecha, descripcion, id]
    );
    res.json({ mensaje: "Consulta actualizada" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar consulta" });
  }
};

exports.deleteConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM consultas WHERE id=?", [id]);
    res.json({ mensaje: "Consulta eliminada" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar consulta" });
  }
};
