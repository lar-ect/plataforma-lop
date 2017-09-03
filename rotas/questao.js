const express = require('express');
const router = express.Router();

const questaoController = require('../controladores/questaoController');
const authController = require('../controladores/authController');
const { catchErrors } = require('../negocio/errorHandlers');

// Questões
router.get('/questoes', catchErrors(questaoController.questoes));

router.get('/questao/adicionar/:id', 
  authController.isLoggedIn,
  authController.temPermissao('CREATE_QUESTAO'), 
  catchErrors(questaoController.adicionarQuestao));

router.post('/questao/adicionar', 
  authController.temPermissao('CREATE_QUESTAO'), 
  catchErrors(questaoController.criarQuestao));

router.post('/questao/adicionar/:id', 
  authController.temPermissao('UPDATE_QUESTAO'),
  catchErrors(questaoController.atualizarQuestao));

/**
 * Parâmetros:
 *  - lista: id de uma lista de exercícios
 */
router.get('/questao/:id', catchErrors(questaoController.getQuestao));

module.exports = router;