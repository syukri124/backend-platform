const express = require('express');
const router = express.Router();
const postinganController = require('../controllers/postinganController');
const {authenticate} = require('../middleware/authentikasi');
const { forPengguna, forPenggunaDanPeninjau } = require('../middleware/authorisasi');

// All Role
router.get('/', postinganController.getAllPostingan);
router.get('/:id', postinganController.getPostinganById);
router.get('/kategori/nama', postinganController.getPostinganByNamaKategori);

// Butuh login + hanya pengguna biasa
router.post('/', authenticate, forPengguna, postinganController.createPostingan);

// Butuh login + hanya pemilik postingan ATAU peninjau
router.put('/:id', authenticate, forPenggunaDanPeninjau, postinganController.updatePostingan);
router.delete('/:id', authenticate, forPenggunaDanPeninjau, postinganController.deletePostingan);

module.exports = router;