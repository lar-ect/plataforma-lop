/**
 * Script de inicialização do sistema.
 * Todas as configurações para iniciar o servidor são feitas abaixo.
 */
const path = require('path');

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const MongoStore = require('connect-mongo')(session);
const promisify = require('es6-promisify');
const helpers = require('./helpers');
const errorHandlers = require('./negocio/errorHandlers');

// Assegura que o servidor está rodando com node >= 7.6
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log(`
    🛑 O servidor está rodando com Node.js em uma versão menor do que 7.6
    Este projeto utiliza funções recentes do Node.js como async/await para lidar com código de execução assíncrona.
    Por favor atualize a versão do Node.js para >= 7.6!
  `);
  process.exit();
}

// Importa as variáveis de ambiente do arquivo variables.env
// Variáveis podem ser acessadas através de process.env.NOME_DA_VARIAVEL
require('dotenv').config({ path: 'variables.env' });

// Conecta com o banco de dados e lida com problemas de conexão
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // → queremos que o mongoose utilize promises ES6
mongoose.connection.on('error', err => {
  console.error(`🙅 🚫 → ${err.message}`);
});

// Inicializa o plugin auto-increment do mongoose para que possamos dar um id
// auto incrementável para cada questão cadastrada no sistema
autoIncrement.initialize(mongoose.connection);

// Import todos os models do projeto para que possamos utilizar em qualquer parte do sistema
require('./dominio/User');
require('./dominio/Questao');
require('./dominio/ListaExercicio');

// Configura estratégia de autenticação local com passport.js
const User = mongoose.model('User');
passport.use(User.createStrategy());
require('./negocio/auth/sigaa');
require('./negocio/auth/github');
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * Abaixo iremos configurar nossa aplicação utilizando o Express. Uma aplicação
 * express é uma série de chamadas de funções que chamamos de middlewares.
 * Sempre que utilizarmos a função app.use(), estamos definindo um middlware.
 * 
 * Toda função de middleware tem acesso aos objetos de requisição e de resposta (req, res)
 * e podem realizar operações em cima desses objetos.
 * 
 * Exemplos de operações realizadas por middlewares:
 *  - Modificar os objetos de requisição e resposta
 *  - Executar código
 *  - Verificar se um usuário está logado ou não e setar o req.user
 */
const app = express();

// Utilizamos o pug como engine de templates
app.set('views', path.join(__dirname, 'views')); // → Arquivos .pug ficam na pasta views
app.set('view engine', 'pug');

// Serve arquivos estáticos na pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Transforma as requisições do tipo raw em propriedades do request em req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Loga todos os requests em desenvolvimento
app.use(require('morgan')('dev'));

// Habilita o uso de métodos para validação direto pelo objeto req de uma requisição
// Ex.: isEmail, sanitizeBody, etc...
app.use(expressValidator());

// Popula req.cookies com os cookies que vieram no request
app.use(cookieParser());

/**
 * Sessões permitem que as informações dos visitantes sejam guardadas em cada request
 * Utilizado para manter os usuários logados e possibilitar o uso de mensagens de flash
 */
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// O projeto utiliza passport.js para autenticação
app.use(passport.initialize());
app.use(passport.session());

/**
 * Permite que sejam enviadas mensagens de 'flash' para o próximo request.
 * Ex.: req.flash('error', 'Ops, algo deu errado!') → Renderiza uma mensagem de erro 
 * na próxima página que o usuário visitar.
 */
app.use(flash());

/**
 * Podemos acessar em nossos templates todas as propriedades disponíveis em res.locals
 * Abaixo passamos algumas propriedades que queremos utilizar nos templates
 */
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// Transforma de APIs baseadas em callbacks para promises
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// Finalmente, definimos nossas próprias rotas depois de passar por todos os middlewares acima
const rotas = require('./rotas/index');
app.use('/', rotas);

// Se a url não bater com nenhuma das nossas rotas, envia um erro 404
app.use(errorHandlers.notFound);

// Verifica se os erros são apenas de validação
app.use(errorHandlers.flashValidationErrors);

// Algo de errado aconteceu. Exibe o erro caso estejamos em desenvolvimento
if (app.get('env') === 'development') {
  /* Erro em desenvolvimento, imprime a stack trace na tela */
  app.use(errorHandlers.developmentErrors);
}

// Handler para erros em produção
app.use(errorHandlers.productionErrors);

// Finalmenteeeeee, inicializa o servidor 😄
app.set('port', process.env.PORT || 8080);
const server = app.listen(app.get('port'), () => {
  console.log(`Servidor rodando na porta: ${server.address().port}`);
});
