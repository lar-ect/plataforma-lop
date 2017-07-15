const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');

exports.index = async (req, res) => {
  const questoes = await Questao.find({});
  const tags = await Questao.find().distinct('tags');
  res.render('index', { title: 'Início', questoes, tags });
};