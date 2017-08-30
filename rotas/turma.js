const express = require('express');
const router = express.Router();

const turmaController = require('../controladores/turmaController');
const authController = require('../controladores/authController');
const { catchErrors } = require('../negocio/errorHandlers');



// Questões
router.get('/turma/:id', authController.isProfessor(), catchErrors(turmaController.getTurma) );

 

module.exports = router;