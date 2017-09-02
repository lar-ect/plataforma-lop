const express = require('express');
const router = express.Router();
const passport = require('passport');

const authController = require('../controladores/authController');
const userController = require('../controladores/userController');
const { catchErrors } = require('../negocio/errorHandlers');

// Usuário
router.get('/login', userController.loginForm);

router.get('/cadastro', userController.cadastroForm);

router.get('/perfil', authController.isLoggedIn, catchErrors(userController.perfil));

/**
 * A autenticação com o github foi retirada para 
 * diminuir a complexidade do fluxo de autenticação do sistema
 */

// router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ]}));

// router.get('/auth/github/callback', 
// 	passport.authenticate('github', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect('/');
//   }
// );


// Sigaa
router.get('/auth/sigaa', passport.authenticate('oauth2'));

router.get('/auth/sigaa/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Autenticação
router.get('/logout', authController.logout);

router.post('/login', authController.login);

router.post('/cadastro', userController.validarRegistro, 
	catchErrors(userController.registrar), authController.login);

router.post('/conta/esqueceu-senha', catchErrors(authController.esqueceuSenha));

router.get('/conta/resetar-senha/:token', catchErrors(authController.resetarSenha));

router.post('/conta/resetar-senha/:token', authController.confirmarSenhas,
	catchErrors(authController.atualizarSenha));
	
module.exports = router;
