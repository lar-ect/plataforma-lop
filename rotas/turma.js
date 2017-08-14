const express = require('express');
const router = express.Router();

const turmaController = require('../controladores/turmaController');
const { catchErrors } = require('../negocio/errorHandlers');

// Questões
router.get('/turma/:id', catchErrors(turmaController.getTurma));

module.exports = router;