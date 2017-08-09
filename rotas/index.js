const express = require('express');
const router = express.Router();
const indexController = require('../controladores/indexController');

// Definição de rotas
router.get('/', indexController.index);

module.exports = router;
