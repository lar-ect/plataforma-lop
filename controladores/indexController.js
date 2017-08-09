const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const ListaExercicio = mongoose.model('ListaExercicio');

exports.index = async (req, res) => {
  const questoes = await Questao.find({});
  const listasExercicio = await ListaExercicio.find({});
  const tags = await Questao.find().distinct('tags');
  res.render('index', { title: 'Início', questoes, listasExercicio, tags });
};