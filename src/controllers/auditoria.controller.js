const pool = require("../data/db");

// Listar logs de auditoría
exports.getLogs = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, entidad, accion, entidad_id, usuario, fecha FROM auditoria ORDER BY fecha DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener auditoría:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Crear log de auditoría
exports.createLog = async (req, res) => {
  try {
    const { entidad, accion, entidad_id, usuario, fecha } = req.body;
    const [result] = await pool.query(
      "INSERT INTO auditoria (entidad, accion, entidad_id, usuario, fecha) VALUES (?, ?, ?, ?, ?)",
      [entidad, accion, entidad_id, usuario, fecha]
    );
    res.json({
      id: result.insertId,
      entidad,
      accion,
      entidad_id,
      usuario,
      fecha,
    });
  } catch (err) {
    console.error("Error al crear log de auditoría:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// (Opcional) Actualizar log — normalmente no se actualiza auditoría, pero se deja por consistencia
exports.updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { entidad, accion, entidad_id, usuario, fecha } = req.body;
    await pool.query(
      "UPDATE auditoria SET entidad=?, accion=?, entidad_id=?, usuario=?, fecha=? WHERE id=?",
      [entidad, accion, entidad_id, usuario, fecha, id]
    );
    res.json({ mensaje: "Log de auditoría actualizado" });
  } catch (err) {
    console.error("Error al actualizar log de auditoría:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Eliminar log
exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM auditoria WHERE id=?", [id]);
    res.json({ mensaje: "Log de auditoría eliminado" });
  } catch (err) {
    console.error("Error al eliminar log de auditoría:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};
