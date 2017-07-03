const mongoose = require('mongoose');

// Assegura que o server está rodando com node >= 7.6
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log('🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou\'re on an older version of node that doesn\'t support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
  process.exit();
}

// Importa as variáveis de ambiente do arquivo variables.env
require('dotenv').config({ path: 'variables.env' });

// Conecta com o banco de dados e lida com bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // -> queremos que o mongoose utilize promises ES6
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// Import todos os models
require('./models/User');

// Inicialização
const app = require('./app');
app.set('port', process.env.PORT || 8080);
const server = app.listen(app.get('port'), () => {
  console.log(`Servidor rodando na porta: ${server.address().port}`);
});
