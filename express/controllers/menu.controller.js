/* controllers/menu.controller.js */
const Menu = require('../models/menu.model');
const BASE_URL = process.env.BASE_URL;

exports.add = async (req, res) => {
  if (!req.body.nama || !req.body.harga) {
    return res.status(400).send({ message: "Nama dan harga tidak boleh kosong!" });
  }

  let imageUrl = null;
  if (req.file) {
    // Jika ada file yang diunggah, gunakan nama file baru dari multer
    imageUrl = `${BASE_URL}/image/get/${req.file.filename}`;
  }

  const menuBaru = {
    nama: req.body.nama,
    harga: req.body.harga,
    kategori_id: req.body.kategori_id || null,
    image_url: imageUrl
  };

  try {
    const data = await Menu.create(menuBaru);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({ message: err.message || "Terjadi kesalahan saat menambah menu." });
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  let imageUrl = req.body.existing_image_url; // Default ke gambar yang ada

  if (req.file) {
    // Jika ada file baru yang diunggah, perbarui URL gambar
    imageUrl = `${BASE_URL}/image/get/${req.file.filename}`;
  }

  const menuUpdate = {
    nama: req.body.nama,
    harga: req.body.harga,
    kategori_id: req.body.kategori_id,
    image_url: imageUrl
  };

  try {
    const result = await Menu.updateById(id, menuUpdate);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: `Menu dengan id ${id} tidak ditemukan.` });
    }
    res.status(200).send({ message: "Menu berhasil diperbarui.", data: { id, ...menuUpdate } });
  } catch (err) {
    res.status(500).send({ message: `Error memperbarui menu dengan id ${id}` });
  }
};

exports.search = async (req, res) => {
    try {
        const data = await Menu.findByIdOrName(req.params.query);
        if (data.length) {
            res.status(200).send(data);
        } else {
            res.status(404).send({ message: `Menu dengan query '${req.params.query}' tidak ditemukan.` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "Terjadi kesalahan saat mencari menu." });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const result = await Menu.remove(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: `Menu dengan id ${req.params.id} tidak ditemukan.` });
        }
        res.status(200).send({ message: "Menu berhasil dihapus!" });
    } catch (err) {
        res.status(500).send({ message: `Tidak dapat menghapus menu dengan id ${req.params.id}` });
    }
};