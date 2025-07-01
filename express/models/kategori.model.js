/* models/kategori.model.js */
const db = require('../utils/db');

const Kategori = {};

Kategori.getAll = async () => {
  const [rows] = await db.query("SELECT * FROM kategori");
  return rows;
};

Kategori.getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM kategori WHERE id = ?", [id]);
  return rows[0];
};

module.exports = Kategori;





