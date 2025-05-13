const express = require('express');
const router = express.Router();
const interaksiController = require('../controllers/interaksiController');

router.get('/', interaksiController.getAllInteraksi);
router.get('/:id', interaksiController.getInteraksiById);
router.post('/', interaksiController.createInteraksi);
router.put('/:id', interaksiController.updateInteraksi);
router.delete('/:id', interaksiController.deleteInteraksi);

module.exports = router;
