/* routes/menu.routes.js */
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const imageController = require('../controllers/image.controller'); // Untuk upload

// Gunakan multer middleware dari imageController
const upload = imageController.upload;

router.post('/add', upload.single('image'), menuController.add);
router.put('/edit/:id', upload.single('image'), menuController.edit);
router.get('/search/:query', menuController.search);
router.delete('/delete/:id', menuController.deleteById);

module.exports = router;