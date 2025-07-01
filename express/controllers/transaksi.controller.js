/* controllers/transaksi.controller.js */
const Transaksi = require('../models/transaksi.model');

exports.add = async (req, res) => {
    // Validasi input
    if (!req.body.items || req.body.items.length === 0) {
        return res.status(400).send({ message: "Transaksi harus memiliki setidaknya satu item." });
    }
    
    const transaksiData = {
        nama_pelanggan: req.body.nama_pelanggan || 'Guest',
        status: req.body.status || 'completed',
        items: req.body.items // array of { menu_id, quantity, harga }
    };

    try {
        const data = await Transaksi.create(transaksiData);
        res.status(201).send({ message: "Transaksi berhasil dibuat.", data });
    } catch (err) {
        res.status(500).send({ message: err.message || "Terjadi kesalahan saat membuat transaksi." });
    }
};

exports.getAll = async (req, res) => {
    try {
        const data = await Transaksi.getAll();
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || "Terjadi kesalahan saat mengambil data transaksi." });
    }
};

exports.getByDate = async (req, res) => {
    // Params tanggal dalam format dd-mm-yyyy
    const { tanggal } = req.params;
    const parts = tanggal.split('-');
    if (parts.length !== 3) {
        return res.status(400).send({ message: "Format tanggal salah. Gunakan dd-mm-yyyy." });
    }
    // Konversi ke format YYYY-MM-DD untuk SQL
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    try {
        const data = await Transaksi.getByDate(formattedDate);
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || "Terjadi kesalahan." });
    }
};