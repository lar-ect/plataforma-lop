const express = require('express');
const router = express.Router();
const authController = require('../controladores/authController');
const provaController = require('../controladores/provaController');
const { catchErrors } = require('../negocio/errorHandlers');

router.get('/prova/adicionar', 
    authController.isLoggedIn,
    authController.temPermissao('CREATE_PROVA'), 
    catchErrors(provaController.adicionarProva));

router.post('/prova/adicionar', 
    authController.isLoggedIn,
    authController.temPermissao('CREATE_PROVA'), 
    catchErrors(provaController.criarProva)
);

// Recebe o id da prova como parâmetro /prova/iniciar?id=X
router.get('/prova/iniciar', 
    authController.isProfessor(),
    catchErrors(provaController.isAutorProva),
    catchErrors(provaController.iniciarProva)
);
    
router.get('/prova/:id', 
    authController.isLoggedIn,
    catchErrors(provaController.verificarTempoLimite),
    catchErrors(provaController.podeVerProva), 
    catchErrors(provaController.getProva)
);

router.get('/prova/:id/questao/:idQuestao',
    authController.isLoggedIn,
    catchErrors(provaController.verificarTempoLimite),
    catchErrors(provaController.podeVerProva),
    catchErrors(provaController.getQuestao)
);

router.get('/prova/:id/relatorio', 
    authController.isLoggedIn,
    catchErrors(provaController.recuperarProva),
    provaController.podeVerProvaRelatorio, 
    catchErrors(provaController.getProvaRelatorio)
);

module.exports = router;