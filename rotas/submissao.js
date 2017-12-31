const express = require('express');
const router = express.Router();

const submissaoController = require('../controladores/submissaoController');
const { catchErrors } = require('../negocio/errorHandlers');

// Questões
router.get('/submissao/:id', catchErrors(submissaoController.getSubmissao));

module.exports = router;
