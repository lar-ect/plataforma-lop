const problemasRoutes = require('./problemas');
const executeRoutes = require('./execute');

module.exports = function(app, db) {
  problemasRoutes(app, db);
  executeRoutes(app, db);

  app.use('/', (req, res) => {
    res.send("Olá, estamos funcionando.");
  });
};