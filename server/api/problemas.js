module.exports = function(app, db) {
  app.get('/problemas/total', (req, res) => {
    console.log('Tentando recuperar a quantidade total de problemas');
    res.json(db.get('problemas').size().value());
  });

  app.get('/problemas/:id', (req, res) => {
    const problema = db.get('problemas').getById(req.params.id).value();
    res.json(problema);
  });

  app.get('/problemas', (req, res) => {
    const problemas = db.get('problemas').value();
    res.json(problemas);
  });

  app.post('/problemas', (req, res) => {
    const data = req.body;
    db.get('problemas').push({
      titulo: data.titulo,
      descricao: data.descricao,
      entradas: data.entradas,
      saidasEsperadas: data.saidasEsperadas
    }).write();
    res.json("OK");
  });
};