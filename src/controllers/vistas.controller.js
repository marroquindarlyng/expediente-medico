const pool = require("../data/db");

// Citas detalladas (JOINs típicos)
exports.getCitasDetalladas = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id,
        p.nombre AS pacienteNombre,
        CONCAT(p.email, ' / ', p.usuario) AS pacienteContacto,
        c.fecha,
        c.hora,
        c.estado
      FROM citas c
      JOIN pacientes p ON p.id = c.paciente_id
      ORDER BY c.fecha DESC, c.hora DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener citas detalladas:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Consultas detalladas (incluye diagnósticos y recetas)
exports.getConsultasDetalladas = async (req, res) => {
  try {
    // Consultas base
    const [consultas] = await pool.query(`
      SELECT 
        con.id,
        con.descripcion AS motivo,
        con.fecha AS citaFecha,
        TIME(con.fecha) AS citaHora
      FROM consultas con
      ORDER BY con.fecha DESC
    `);

    // Diagnósticos por consulta
    const [diags] = await pool.query(`
      SELECT id, consulta_id, descripcion FROM diagnosticos
    `);

    // Recetas por consulta (con nombre de medicamento)
    const [recs] = await pool.query(`
      SELECT r.id, r.consulta_id, m.nombre 
      FROM recetas r
      JOIN medicamentos m ON m.id = r.medicamento_id
    `);

    // Armar arrays en memoria
    const byConsulta = (arr) =>
      arr.reduce((acc, item) => {
        acc[item.consulta_id] = acc[item.consulta_id] || [];
        acc[item.consulta_id].push(item);
        return acc;
      }, {});

    const diagsMap = byConsulta(diags);
    const recsMap = byConsulta(recs);

    const enriched = consultas.map((c) => ({
      ...c,
      diagnosticos: diagsMap[c.id] || [],
      recetas: recsMap[c.id] || [],
    }));

    res.json(enriched);
  } catch (err) {
    console.error("Error al obtener consultas detalladas:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Vistas para paciente autenticado (placeholder: filtra por ?paciente_id)
exports.getMisCitas = async (req, res) => {
  try {
    const { paciente_id } = req.query;
    const [rows] = await pool.query(
      `
      SELECT c.id, c.fecha, c.hora, c.estado
      FROM citas c
      WHERE c.paciente_id = ?
      ORDER BY c.fecha DESC, c.hora DESC
      `,
      [paciente_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener mis citas:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

exports.getMisRecetas = async (req, res) => {
  try {
    const { paciente_id } = req.query;
    const [rows] = await pool.query(
      `
      SELECT r.id, r.dosis, r.duracion, r.indicaciones, m.nombre AS medicamento
      FROM recetas r
      JOIN consultas con ON con.id = r.consulta_id
      JOIN medicamentos m ON m.id = r.medicamento_id
      WHERE con.paciente_id = ?
      ORDER BY r.id DESC
      `,
      [paciente_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener mis recetas:", err);
    res.status(500).json({ mensaje: "Error interno" });
  }
};
