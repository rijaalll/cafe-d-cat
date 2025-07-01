/* routes/kategori.routes.js */
const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategori.controller');

router.get('/all', kategoriController.getAll);
router.get('/:id', kategoriController.getById);

module.exports = router;