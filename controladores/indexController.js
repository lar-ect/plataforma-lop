const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const ListaExercicio = mongoose.model('ListaExercicio');
const Sugestao = mongoose.model('Sugestao');
const Submissao = mongoose.model('Submissao');
const permissoes = require('../dominio/Permissoes');

exports.index = async (req, res) => {
  const questoes = await Questao.find({oculta: {$in: [null, false]}});
  const listasExercicio = await ListaExercicio.find({});
  const tags = await Questao.find().distinct('tags');
  const progressoLista = new Map();
  if (req.user) {
    const submissoes = await Submissao.listarSubmissoesUsuario(req.user);
    let questoesOcultas = null;
    if (permissoes.temPermissao(req.user, 'VER_QUESTOES_OCULTAS')) {
      questoesOcultas = await Questao.find({oculta: true});
    }
    res.render('index', { 
      title: 'Início', 
      questoes, 
      listasExercicio, 
      tags, 
      submissoes, 
      filtrarSubmissoesLista,
      questoesOcultas,
      provasUsuario: req.provasUsuario
    });
  } else {
    res.render('index', { title: 'Início', questoes, listasExercicio, tags });
  }
};

function filtrarSubmissoesLista(lista, submissoes) {
  const progresso = {};
  if (lista.questoes || lista.questoes.length > 0) {
    return Submissao.calcularProgresso(lista.questoes.length, lista.questoes.filter(q => submissoes.has(q.toString())).length);
  }
  return progresso;
}

exports.sugestao = async (req, res) => {
  const sugestao = new Sugestao(req.body);
  await sugestao.save();
  res.status(200).send('Submissão enviada com sucesso');
};

exports.processing = (req, res) => {
  res.render('processing', { title: 'Processing.js' });
}