/* models/transaksi.model.js */
const db = require('../utils/db');

const Transaksi = {};

Transaksi.create = async (transaksiData) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert ke tabel transaksi
    const [transaksiResult] = await connection.query(
      "INSERT INTO transaksi (nama_pelanggan, status) VALUES (?, ?)",
      [transaksiData.nama_pelanggan, transaksiData.status]
    );
    const transaksiId = transaksiResult.insertId;

    // 2. Insert ke tabel transaksi_item
    for (const item of transaksiData.items) {
      await connection.query(
        "INSERT INTO transaksi_item (transaksi_id, menu_id, quantity, harga) VALUES (?, ?, ?, ?)",
        [transaksiId, item.menu_id, item.quantity, item.harga]
      );
    }

    await connection.commit();
    return { id: transaksiId, ...transaksiData };
  } catch (err) {
    await connection.rollback();
    console.error("Error saat membuat transaksi:", err);
    throw err; // Lemparkan error agar bisa ditangkap controller
  } finally {
    connection.release();
  }
};

Transaksi.getAll = async () => {
    const sql = `
        SELECT 
            t.id AS transaksi_id, 
            t.tanggal, 
            t.nama_pelanggan, 
            t.status,
            ti.menu_id,
            m.nama AS nama_menu,
            ti.quantity,
            ti.harga AS harga_saat_transaksi
        FROM transaksi t
        JOIN transaksi_item ti ON t.id = ti.transaksi_id
        JOIN menu m ON ti.menu_id = m.id
        ORDER BY t.tanggal DESC
    `;
    const [rows] = await db.query(sql);
    // Disini Anda bisa melakukan grouping data jika diperlukan
    return rows;
};

Transaksi.getByDate = async (date) => { // date format: YYYY-MM-DD
    const sql = `
        SELECT * FROM transaksi WHERE DATE(tanggal) = ?
    `;
    const [rows] = await db.query(sql, [date]);
    // Untuk mendapatkan detail item, perlu query tambahan atau join
    return rows;
};

module.exports = Transaksi;