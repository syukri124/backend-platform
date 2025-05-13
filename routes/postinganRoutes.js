const express = require('express');
const router = express.Router();
const postinganController = require('../controllers/postinganController');

router.post('/', postinganController.createPostingan);
router.get('/', postinganController.getAllPostingan);
router.get('/:id', postinganController.getPostinganById);
router.put('/:id', postinganController.updatePostingan);
router.delete('/:id', postinganController.deletePostingan);

module.exports = router;
