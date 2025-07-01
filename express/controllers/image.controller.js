/* controllers/image.controller.js */
const multer = require('multer');
const path = require('path');

// Fungsi untuk menghasilkan string acak
const generateRandomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // Folder penyimpanan
  },
  filename: (req, file, cb) => {
    const randomName = generateRandomString(5);
    const extension = path.extname(file.originalname);
    const newFilename = randomName + extension;
    req.newFilename = newFilename; // Menyimpan nama file baru di request object
    cb(null, newFilename);
  }
});

const upload = multer({ storage: storage });

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Tidak ada file yang diunggah.' });
  }
  // Nama file sudah disimpan oleh middleware multer di req.newFilename
  res.status(200).send({
    message: 'File berhasil diunggah.',
    fileName: req.newFilename
  });
};

module.exports = {
  upload,
  uploadFile
};








