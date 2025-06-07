const express = require('express');
const router = express.Router();
const pixController = require('../controllers/pixController');

router.post('/gerar', pixController.gerarPix);
router.get('/status/:id', pixController.verificarStatus);

module.exports = router;