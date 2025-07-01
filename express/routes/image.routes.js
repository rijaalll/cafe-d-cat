/* routes/image.routes.js */
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');

// Middleware untuk upload ada di controller karena multer perlu dikonfigurasi di sana
router.post('/upload', imageController.upload.single('image'), imageController.uploadFile);

module.exports = router;