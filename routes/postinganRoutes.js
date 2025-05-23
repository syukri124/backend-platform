const express = require('express');
const router = express.Router();
const postinganController = require('../controllers/postinganController');
const {authenticate} = require('../middleware/authMiddleware');
const {forPengguna, forPemilikAtauPengelola}  = require('../middleware/authorizationPostingan');

// All Role
router.get('/', postinganController.getAllPostingan);
router.get('/:id', postinganController.getPostinganById);
router.get('/kategori/nama', postinganController.getPostinganByNamaKategori);

// Butuh login + hanya pengguna biasa
router.post('/', authenticate, forPengguna, postinganController.createPostingan);

// Butuh login + hanya pemilik postingan ATAU pengelola
router.put('/:id', authenticate, forPemilikAtauPengelola, postinganController.updatePostingan);
router.delete('/:id', authenticate, forPemilikAtauPengelola, postinganController.deletePostingan);

module.exports = router;