const express = require('express');
const router = express.Router();

const apiController = require('../controladores/apiController');
const validarRegistro = require('../controladores/userController').validarRegistro;
const questaoController = require('../controladores/questaoController');
const authController = require('../controladores/authController');
const provaController = require('../controladores/provaController');
const diagnosticoController = require('../controladores/diagnosticoController');
const { catchErrors } = require('../negocio/errorHandlers');

// API v1

// Autenticação via API
router.get('/api/v1/lop/status', apiController.lopStatus);
router.post('/api/v1/cadastro', validarRegistro, catchErrors(apiController.registrarAPI));
router.post('/api/v1/login', apiController.loginUser);
router.post('/api/v1/conta/esqueceu-senha', catchErrors(apiController.esqueceuSenha));
router.post('/api/v1/session-status', apiController.sessionStatus);
router.post('/api/v1/finalizar-session', apiController.finalizarSession);

router.post('/api/v1/questoes/:id/favoritar', questaoController.favoritarQuestao);

router.post('/api/v1/executar', apiController.incrementarExecucoes, catchErrors(apiController.executarCodigo));

router.post(
  '/api/v1/executar/questao',
  apiController.incrementarExecucoes,
  catchErrors(apiController.executarCodigoQuestao)
);

router.post('/api/v1/executar/questao-com-resultados', apiController.executarCodigoComResultado);

router.post('/api/v1/submeter/questao', catchErrors(apiController.submeterCodigoQuestao));

router.post('/api/v1/rascunho/questao', catchErrors(apiController.salvarRascunho));

router.get('/api/v1/tags', catchErrors(apiController.getTags));

router.get('/api/v1/questoes', catchErrors(apiController.getQuestoes));

router.get('/api/v1/clicou-novidades', apiController.incrementarCliqueNovidades);

// Prova
router.post(
  '/api/v1/executar/prova/questao',
  authController.isLoggedIn,
  apiController.incrementarExecucoes,
  catchErrors(apiController.executarCodigoQuestaoProva)
);

router.post(
  '/api/v1/submeter/prova/questao',
  authController.isLoggedIn,
  catchErrors(provaController.podeSubmeter),
  catchErrors(apiController.submeterCodigoQuestaoProva)
);

router.get('/api/v1/executar-diagnostico-questoes', catchErrors(diagnosticoController.executarDiagnosticoQuestoes));

module.exports = router;
