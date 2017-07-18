const express = require("express");
const router = express.Router();
const passport = require("passport");
const { catchErrors } = require("../negocio/errorHandlers");
const indexController = require("../controladores/indexController");
const questaoController = require("../controladores/questaoController");
const apiController = require("../controladores/apiController");
const authController = require("../controladores/authController");
const userController = require("../controladores/userController");

// Definição de rotas
router.get("/", indexController.index);

// Github auth
router.get("/auth/github", 
  passport.authenticate("github", { scope: [ "user:email" ]})
);

router.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

// Usuário
router.get("/login", userController.loginForm);
router.get("/cadastro", userController.cadastroForm);
router.get("/perfil", authController.isLoggedIn, userController.perfil);

// Autenticação
router.get("/logout", authController.logout);
router.post("/login", authController.login);
router.post(
  "/cadastro",
  userController.validarRegistro,
  userController.registrar,
  authController.login
);
router.post("/conta/esqueceu-senha", catchErrors(authController.esqueceuSenha));
router.get(
  "/conta/resetar-senha/:token",
  catchErrors(authController.resetarSenha)
);
router.post(
  "/conta/resetar-senha/:token",
  authController.confirmarSenhas,
  catchErrors(authController.atualizarSenha)
);

// Questões
router.get("/questoes", catchErrors(questaoController.questoes));
router.get("/questao/adicionar", questaoController.adicionarQuestao);
router.post("/questao/adicionar", catchErrors(questaoController.criarQuestao));
router.post(
  "/questao/adicionar/:id",
  catchErrors(questaoController.atualizarQuestao)
);
router.get(
  "/questao/:identificador",
  catchErrors(questaoController.getQuestao)
);

// API v1
router.post("/api/v1/executar", catchErrors(apiController.executarCodigo));
router.post(
  "/api/v1/executar/questao",
  catchErrors(apiController.executarCodigoQuestao)
);
router.get("/api/v1/tags", catchErrors(apiController.getTags));

module.exports = router;
