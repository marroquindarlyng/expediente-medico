const pool = require("../data/db");

// Listar medicamentos
exports.getMedicamentos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, descripcion, stock, precio FROM medicamentos"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener medicamentos:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Crear medicamento
exports.createMedicamento = async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio } = req.body;
    const [result] = await pool.query(
      "INSERT INTO medicamentos (nombre, descripcion, stock, precio) VALUES (?, ?, ?, ?)",
      [nombre, descripcion, stock, precio]
    );
    res.json({ id: result.insertId, nombre, descripcion, stock, precio });
  } catch (err) {
    console.error("Error al crear medicamento:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Actualizar medicamento
exports.updateMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, stock, precio } = req.body;
    await pool.query(
      "UPDATE medicamentos SET nombre=?, descripcion=?, stock=?, precio=? WHERE id=?",
      [nombre, descripcion, stock, precio, id]
    );
    res.json({ mensaje: "Medicamento actualizado" });
  } catch (err) {
    console.error("Error al actualizar medicamento:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Eliminar medicamento
exports.deleteMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM medicamentos WHERE id=?", [id]);
    res.json({ mensaje: "Medicamento eliminado" });
  } catch (err) {
    console.error("Error al eliminar medicamento:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Catálogo para selects
exports.getCatalogo = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre FROM medicamentos ORDER BY nombre ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener catálogo de medicamentos:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};
