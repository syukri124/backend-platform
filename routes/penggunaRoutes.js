const express = require('express');
const router = express.Router();
const penggunaController = require('../controllers/penggunaController');

router.get('/', penggunaController.getAllPengguna);
router.get('/:id', penggunaController.getPenggunaById);
router.get('/nim/:nim', penggunaController.getPenggunaByNim);
router.post('/', penggunaController.createPengguna);
router.put('/:id', penggunaController.updatePengguna);
router.delete('/:id', penggunaController.deletePengguna);

module.exports = router;
