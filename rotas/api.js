const express = require('express');
const router = express.Router();

const apiController = require('../controladores/apiController');
const questaoController = require('../controladores/questaoController');
const authController = require('../controladores/authController');
const provaController = require('../controladores/provaController');
const { catchErrors } = require('../negocio/errorHandlers');

// API v1
router.post('/api/v1/questoes/:id/favoritar', questaoController.favoritarQuestao);

router.post('/api/v1/executar', apiController.incrementarExecucoes, catchErrors(apiController.executarCodigo));

router.post('/api/v1/executar/questao', apiController.incrementarExecucoes, catchErrors(apiController.executarCodigoQuestao));

router.post('/api/v1/executar/questao-com-resultados', apiController.executarCodigoComResultado);

router.post('/api/v1/submeter/questao', catchErrors(apiController.submeterCodigoQuestao));

router.get('/api/v1/tags', catchErrors(apiController.getTags));

router.get('/api/v1/questoes', catchErrors(apiController.getQuestoes));

router.get('/api/v1/clicou-novidades', apiController.incrementarCliqueNovidades);

// Prova
router.post('/api/v1/executar/prova/questao', 
	authController.isLoggedIn,
	apiController.incrementarExecucoes, 
	catchErrors(apiController.executarCodigoQuestaoProva)
);

router.post('/api/v1/submeter/prova/questao', 
	authController.isLoggedIn,
	catchErrors(provaController.podeSubmeter),
	catchErrors(apiController.submeterCodigoQuestaoProva)
);

module.exports = router;