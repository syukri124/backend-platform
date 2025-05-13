const express = require('express');
const router = express.Router();
const komentarController = require('../controllers/komentarController');

router.get('/', komentarController.getAllKomentar);
router.get('/:id', komentarController.getKomentarById);
router.post('/', komentarController.createKomentar);
router.put('/:id', komentarController.updateKomentar);
router.delete('/:id', komentarController.deleteKomentar);

module.exports = router;
