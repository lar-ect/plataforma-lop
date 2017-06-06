const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const low = require('lowdb');

const app = express();
const db = low('./db.json');

db._.mixin(require('lodash-id'));

db.defaults({ 
  version: require('./package.json').version,
  problemas: []
}).write();

app.set('port', process.env.PORT || 5000) 

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

require('./api')(app, db);
app.listen(app.get('port'), () => {
  console.log('Estamos ao vivo na porta ' + app.get('port'));
});

