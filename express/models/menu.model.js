/* models/menu.model.js */
const db = require('../utils/db');

const Menu = {};

Menu.create = async (newMenu) => {
  const [result] = await db.query("INSERT INTO menu SET ?", newMenu);
  return { id: result.insertId, ...newMenu };
};

Menu.updateById = async (id, menu) => {
  const [result] = await db.query(
    "UPDATE menu SET nama = ?, harga = ?, kategori_id = ?, image_url = ? WHERE id = ?",
    [menu.nama, menu.harga, menu.kategori_id, menu.image_url, id]
  );
  return result;
};

Menu.findByIdOrName = async (query) => {
    const sql = `
        SELECT m.*, k.nama AS nama_kategori 
        FROM menu m 
        LEFT JOIN kategori k ON m.kategori_id = k.id 
        WHERE m.id = ? OR m.nama LIKE ?
    `;
    const [rows] = await db.query(sql, [query, `%${query}%`]);
    return rows;
};

Menu.remove = async (id) => {
  const [result] = await db.query("DELETE FROM menu WHERE id = ?", [id]);
  return result;
};

module.exports = Menu;