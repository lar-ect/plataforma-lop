const express = require("express");
const router = express.Router();
const { catchErrors } = require("../handlers/errorHandlers");
const controller = require("../controllers/indexController");

// Definição de rotas
router.get("/", controller.index);
router.get("/flash", controller.flash);
router.get("/questoes", controller.questoes);

module.exports = router;