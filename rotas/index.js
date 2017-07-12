const express = require("express");
const router = express.Router();
const { catchErrors } = require("../negocio/errorHandlers");
const indexController = require("../controladores/indexController");
const questaoController = require("../controladores/questaoController");
const apiController = require("../controladores/apiController");

// Definição de rotas
router.get("/", indexController.index);

// Questões
router.get("/questoes", catchErrors(questaoController.questoes));
router.get("/questao/adicionar", questaoController.adicionarQuestao);
router.post("/questao/adicionar", catchErrors(questaoController.criarQuestao));
router.post("/questao/adicionar/:id", catchErrors(questaoController.atualizarQuestao));
router.get("/questao/:identificador", catchErrors(questaoController.getQuestao));

// API v1
router.post("/api/v1/executar", catchErrors(apiController.executarCodigo));
router.post("/api/v1/executar/questao", catchErrors(apiController.executarCodigoQuestao));

module.exports = router;