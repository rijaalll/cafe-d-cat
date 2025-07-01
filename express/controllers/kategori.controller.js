/* controllers/kategori.controller.js */
const Kategori = require('../models/kategori.model');

exports.getAll = async (req, res) => {
  try {
    const kategori = await Kategori.getAll();
    res.status(200).send(kategori);
  } catch (err) {
    res.status(500).send({ message: err.message || "Terjadi kesalahan saat mengambil data kategori." });
  }
};

exports.getById = async (req, res) => {
  try {
    const kategori = await Kategori.getById(req.params.id);
    if (kategori) {
      res.status(200).send(kategori);
    } else {
      res.status(404).send({ message: `Kategori dengan id ${req.params.id} tidak ditemukan.` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message || "Terjadi kesalahan." });
  }
};