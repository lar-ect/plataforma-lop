const express = require('express');
const router = express.Router();
const indexController = require('../controladores/indexController');
const provaController = require('../controladores/provaController');
const { catchErrors } = require('../negocio/errorHandlers');

// Definição de rotas
router.get('/', catchErrors(provaController.findProvaByUserId), indexController.index);

router.get('/processing', indexController.processing);

router.post('/sugestao', catchErrors(indexController.sugestao));

module.exports = router;
