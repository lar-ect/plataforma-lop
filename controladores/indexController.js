const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const ListaExercicio = mongoose.model('ListaExercicio');
const Sugestao = mongoose.model('Sugestao');

exports.index = async (req, res) => {
  const questoes = await Questao.find({});
  const listasExercicio = await ListaExercicio.find({});
  const tags = await Questao.find().distinct('tags');
  res.render('index', { title: 'Início', questoes, listasExercicio, tags });
};

exports.sugestao = async (req, res) => {
  const sugestao = new Sugestao(req.body);
  await sugestao.save();
  res.status(200).send('Submissão enviada com sucesso');
};