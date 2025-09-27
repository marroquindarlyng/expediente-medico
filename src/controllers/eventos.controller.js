const pool = require("../data/db");

// Listar eventos
exports.getEventos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, titulo, descripcion, fecha, hora FROM eventos ORDER BY fecha DESC, hora DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener eventos:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Crear evento
exports.createEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, hora } = req.body;
    const [result] = await pool.query(
      "INSERT INTO eventos (titulo, descripcion, fecha, hora) VALUES (?, ?, ?, ?)",
      [titulo, descripcion, fecha, hora]
    );
    res.json({ id: result.insertId, titulo, descripcion, fecha, hora });
  } catch (err) {
    console.error("Error al crear evento:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Actualizar evento
exports.updateEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fecha, hora } = req.body;
    await pool.query(
      "UPDATE eventos SET titulo=?, descripcion=?, fecha=?, hora=? WHERE id=?",
      [titulo, descripcion, fecha, hora, id]
    );
    res.json({ mensaje: "Evento actualizado" });
  } catch (err) {
    console.error("Error al actualizar evento:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Eliminar evento
exports.deleteEvento = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM eventos WHERE id=?", [id]);
    res.json({ mensaje: "Evento eliminado" });
  } catch (err) {
    console.error("Error al eliminar evento:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};
