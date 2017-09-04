const express = require('express');
const router = express.Router();
const authController = require('../controladores/authController');
const listaExercicioController = require('../controladores/listaExercicioController');
const { catchErrors } = require('../negocio/errorHandlers');

router.get('/listas', catchErrors(listaExercicioController.getListas));

router.get('/lista/adicionar', authController.isLoggedIn,
    authController.temPermissao('CREATE_QUESTAO'), (listaExercicioController.adicionarLista));

router.get('/lista/editar/:id', authController.isLoggedIn,
    authController.temPermissao('CREATE_QUESTAO'), catchErrors(listaExercicioController.editar));

router.post('/lista/adicionar', authController.isLoggedIn,
    authController.temPermissao('CREATE_QUESTAO'), catchErrors(listaExercicioController.criarLista));

router.post('/lista/adicionar/:id', authController.isLoggedIn,
    authController.temPermissao('CREATE_QUESTAO'), catchErrors(listaExercicioController.atualizarLista));

router.get('/lista/:id', catchErrors(listaExercicioController.getLista));

module.exports = router;