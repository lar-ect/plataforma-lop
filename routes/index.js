const express = require("express");
const router = express.Router();
const { catchErrors } = require("../handlers/errorHandlers");
const controller = require("../controllers/indexController");
const apiController = require("../controllers/apiController");

// Definição de rotas
router.get("/", controller.index);
router.get("/flash", controller.flash);
router.get("/questoes", catchErrors(controller.questoes));
router.get("/questao/adicionar", controller.adicionarQuestao);
router.post("/questao/adicionar", catchErrors(controller.criarQuestao));
router.post("/questao/adicionar/:id", catchErrors(controller.atualizarQuestao));
router.get("/questao/:identificador", catchErrors(controller.getQuestao));


// API
router.post("/api/v1/executar", catchErrors(apiController.executarCodigo));
router.post("/api/v1/executar/questao", catchErrors(apiController.executarCodigoQuestao));
module.exports = router;