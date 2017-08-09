const express = require('express');
const router = express.Router();

const apiController = require('../controladores/apiController');
const questaoController = require('../controladores/questaoController');
const { catchErrors } = require('../negocio/errorHandlers');

// API v1
router.post('/v1/questoes/:id/favoritar', questaoController.favoritarQuestao);

router.post('/v1/executar', catchErrors(apiController.executarCodigo));

router.post('/v1/executar/questao', catchErrors(apiController.executarCodigoQuestao));

router.get('/v1/tags', catchErrors(apiController.getTags));

router.get('/v1/questoes', catchErrors(apiController.getQuestoes));

module.exports = router;