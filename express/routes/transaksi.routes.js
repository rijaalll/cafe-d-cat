/* routes/transaksi.routes.js */
const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksi.controller');

router.post('/add', transaksiController.add);
router.get('/get/all', transaksiController.getAll);
router.get('/get/:tanggal', transaksiController.getByDate); // format: dd-mm-yyyy

module.exports = router;