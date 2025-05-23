const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriControllers');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', kategoriController.getAllKategori);
router.get('/:id', kategoriController.getKategoriById);
router.post('/', authenticate, kategoriController.createKategori);
router.put('/:id', kategoriController.updateKategori);
router.delete('/:id', kategoriController.deleteKategori);

module.exports = router;
