const express = require('express');
const router = express.Router();

const questaoController = require('../controladores/questaoController');
const authController = require('../controladores/authController');
const { catchErrors } = require('../negocio/errorHandlers');

// Questões
router.get('/questoes', catchErrors(questaoController.questoes));

router.get('/questao/adicionar', authController.isLoggedIn,
  authController.temPermissao('CREATE_QUESTAO'), questaoController.adicionarQuestao);

router.post('/questao/adicionar', catchErrors(questaoController.criarQuestao));

router.post('/questao/adicionar/:id', catchErrors(questaoController.atualizarQuestao));

router.get('/questao/:id', catchErrors(questaoController.getQuestao));

module.exports = router;