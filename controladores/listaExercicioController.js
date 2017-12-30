const mongoose = require('mongoose');
const ListaExercicio = mongoose.model('ListaExercicio');
const Submissao = mongoose.model('Submissao');

exports.getLista = async (req, res) => {
  const lista = await ListaExercicio.findOne({ _id: req.params.id }).populate('questoes');
  if (req.user && lista.questoes && lista.questoes.length > 0) {
    const submissoes = await Submissao.listarSubmissoesUsuario(req.user, lista.questoes);
    const progresso = Submissao.calcularProgresso(lista.questoes.length, submissoes.size);
    res.render('questao/lista', { title: `Lista ${lista.titulo}`, lista, progresso, submissoes });
  } else {
    res.render('questao/lista', { title: `Lista ${lista.titulo}`, lista });
  }
};

exports.getListas = async (req, res) => {
  const listas = await ListaExercicio.find({});
  res.render('questao/listas', { title: 'Listas de exercícios', listas });
};

exports.adicionarLista = (req, res) => {
  res.render('questao/editarLista', {
    title: 'Adiciona Lista de Exercícios'
  });
};

exports.editar = async (req, res) => {
  const lista = await ListaExercicio.findOne({ _id: req.params.id }).populate('questoes');

  res.render('questao/editarLista', {
    title: 'Editar Lista de Exercícios',
    lista
  });
};

exports.criarLista = async (req, res) => {
  const novaLista = {
    titulo: req.body.titulo,
    questoes: req.body.questoes
  };
  const lista = await new ListaExercicio(novaLista).save();
  req.flash('success', 'Adicionou uma nova lista de exercícios com sucesso!');
  res.redirect(`/lista/${lista._id}`);
};

exports.atualizarLista = async (req, res) => {
  const novaLista = {
    titulo: req.body.titulo,
    questoes: req.body.questoes || []
  };
  const lista = await ListaExercicio.findByIdAndUpdate(req.params.id, novaLista, {
    new: true, // return the new store instead of the old one
    runValidators: true,
    context: 'query'
  }).exec();

  req.flash('success', 'Lista de exercícios atualizada com sucesso!');
  res.redirect(`/lista/${lista._id}`);
};
