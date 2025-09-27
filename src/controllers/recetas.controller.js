const pool = require("../data/db");

// Listar recetas
exports.getRecetas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, consulta_id, medicamento_id, dosis, duracion, indicaciones FROM recetas"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener recetas:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Crear receta
exports.createReceta = async (req, res) => {
  try {
    const { consulta_id, medicamento_id, dosis, duracion, indicaciones } =
      req.body;
    const [result] = await pool.query(
      "INSERT INTO recetas (consulta_id, medicamento_id, dosis, duracion, indicaciones) VALUES (?, ?, ?, ?, ?)",
      [consulta_id, medicamento_id, dosis, duracion, indicaciones]
    );
    res.json({
      id: result.insertId,
      consulta_id,
      medicamento_id,
      dosis,
      duracion,
      indicaciones,
    });
  } catch (err) {
    console.error("Error al crear receta:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Actualizar receta
exports.updateReceta = async (req, res) => {
  try {
    const { id } = req.params;
    const { consulta_id, medicamento_id, dosis, duracion, indicaciones } =
      req.body;
    await pool.query(
      "UPDATE recetas SET consulta_id=?, medicamento_id=?, dosis=?, duracion=?, indicaciones=? WHERE id=?",
      [consulta_id, medicamento_id, dosis, duracion, indicaciones, id]
    );
    res.json({ mensaje: "Receta actualizada" });
  } catch (err) {
    console.error("Error al actualizar receta:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Eliminar receta
exports.deleteReceta = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM recetas WHERE id=?", [id]);
    res.json({ mensaje: "Receta eliminada" });
  } catch (err) {
    console.error("Error al eliminar receta:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};
