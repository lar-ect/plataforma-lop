const express = require('express');
const router = express.Router();
const gerenciadorController = require('../controladores/gerenciadorController');
const authController = require('../controladores/authController');

router.get('/', authController.temPermissao('VER_GERENCIADOR'),
	gerenciadorController.index);

module.exports = router;