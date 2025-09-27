const pool = require("../data/db");

exports.getCitas = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM citas");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener citas" });
  }
};

exports.createCita = async (req, res) => {
  try {
    const { paciente_id, medico_id, fecha, hora, motivo } = req.body;
    const [result] = await pool.query(
      "INSERT INTO citas (paciente_id, medico_id, fecha, hora, motivo) VALUES (?, ?, ?, ?, ?)",
      [paciente_id, medico_id, fecha, hora, motivo]
    );
    res.json({
      id: result.insertId,
      paciente_id,
      medico_id,
      fecha,
      hora,
      motivo,
    });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al crear cita" });
  }
};

exports.updateCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { paciente_id, medico_id, fecha, hora, motivo } = req.body;
    await pool.query(
      "UPDATE citas SET paciente_id=?, medico_id=?, fecha=?, hora=?, motivo=? WHERE id=?",
      [paciente_id, medico_id, fecha, hora, motivo, id]
    );
    res.json({ mensaje: "Cita actualizada" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar cita" });
  }
};

exports.deleteCita = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM citas WHERE id=?", [id]);
    res.json({ mensaje: "Cita eliminada" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar cita" });
  }
};
