const express = require('express');
const router = express.Router();
const indexController = require('../controladores/indexController');
const { catchErrors } = require('../negocio/errorHandlers');

// Definição de rotas
router.get('/', indexController.index);

router.post('/sugestao', catchErrors(indexController.sugestao));

module.exports = router;
