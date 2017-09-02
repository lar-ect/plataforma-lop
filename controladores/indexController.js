const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const ListaExercicio = mongoose.model('ListaExercicio');
const Sugestao = mongoose.model('Sugestao');
const Submissao = mongoose.model('Submissao');

exports.index = async (req, res) => {
  const questoes = await Questao.find({});
  const listasExercicio = await ListaExercicio.find({});
  const tags = await Questao.find().distinct('tags');
  const progressoLista = new Map();
  if (req.user) {
    const submissoes = await Submissao.listarSubmissoesUsuario(req.user);
    res.render('index', { title: 'Início', questoes, listasExercicio, tags, submissoes, filtrarSubmissoesLista });
  } else {
    res.render('index', { title: 'Início', questoes, listasExercicio, tags });
  }
};

function filtrarSubmissoesLista(lista, submissoes) {
  return Submissao.calcularProgresso(lista.questoes.length, lista.questoes.filter(q => submissoes.has(q.toString())).length);
}

exports.sugestao = async (req, res) => {
  const sugestao = new Sugestao(req.body);
  await sugestao.save();
  res.status(200).send('Submissão enviada com sucesso');
};