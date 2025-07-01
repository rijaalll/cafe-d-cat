// Import dependensi
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Untuk memuat variabel dari .env

// Import routes
const imageRoutes = require('./routes/image.routes');
const kategoriRoutes = require('./routes/kategori.routes');
const menuRoutes = require('./routes/menu.routes');
const transaksiRoutes = require('./routes/transaksi.routes');

// Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Mengizinkan Cross-Origin Resource Sharing
app.use(express.json()); // Mem-parsing body request sebagai JSON
app.use(express.urlencoded({ extended: true })); // Mem-parsing body request dari form

// Middleware untuk menyajikan file gambar secara statis
// Endpoint /image/get/namafile.jpg akan diarahkan ke folder /images/namafile.jpg
app.use('/image/get', express.static(path.join(__dirname, 'images')));

// Menggunakan routes
app.use('/image', imageRoutes);
app.use('/kategori', kategoriRoutes);
app.use('/menu', menuRoutes);
app.use('/transaksi', transaksiRoutes);

// Route default
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API Coffee Shop.' });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}.`);
  console.log(`Akses gambar di: ${process.env.BASE_URL}/image/get/`);
});
