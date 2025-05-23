const express = require('express');
const router = express.Router();
const komentarController = require('../controllers/komentarController');
const { authenticate } = require('../middleware/authMiddleware');
const { forPengguna, forPemilikAtauPengelola } = require('../middleware/authorizationKomentar');


router.get('/', komentarController.getAllKomentar);
router.get('/:id', komentarController.getKomentarById);
router.post('/', authenticate, forPengguna, komentarController.createKomentar);
router.put('/:id', authenticate, forPengguna, komentarController.updateKomentar);
router.delete('/:id', authenticate, forPemilikAtauPengelola, komentarController.deleteKomentar);

module.exports = router;