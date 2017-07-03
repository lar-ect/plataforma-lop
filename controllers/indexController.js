exports.index = (req, res) => {
  console.log(res.locals.flash);
  res.render('index', { title: 'Início' });
};

exports.flash = (req, res) => {
  req.flash('info', 'Flash is back!');
  res.redirect('/');
};

exports.questoes = (req, res) => {
  res.render('questoes', { title: 'Questões' });
};