const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const User = mongoose.model('User');
const ListaExercicio = mongoose.model('ListaExercicio');

exports.questoes = async (req, res) => {
  const questoes = await Questao.find({});
  res.render('questoes', { title: 'Questões', questoes });
};

exports.getQuestao = async (req, res) => {
  const questao = await Questao.findOne({
    identificador: req.params.identificador
  });
  const solucao = questao.solucao || null;
  res.render('questao/questao', {
    title: `Questão ${questao.identificador}`,
    questao,
    solucao
  });
};

exports.adicionarQuestao = (req, res) => {
  res.render('editarQuestao', { 
    title: 'Adicionar Questão', 
    dificuldades: Questao.getDificuldades(),
    classificacoes: Questao.getClassificacoes()
  });
};

exports.criarQuestao = async (req, res) => {
  const { exemploEntrada, exemploSaida, resultados } = JSON.parse(
    req.body.resultados
  );
  const novaQuestao = {
    titulo: req.body.titulo,
    enunciado: req.body.enunciado,
    tags: req.body.tags,
    dificuldade: req.body.dificuldade,
    classificacao: req.body.classificacao,
    exemploEntrada,
    exemploSaida,
    resultados
  };
  const questao = await new Questao(novaQuestao).save();
  req.flash("success", "Adicionou uma nova questão com sucesso!");
  res.redirect(`/questao/${questao.identificador}`);
};

exports.atualizarQuestao = (req, res) => {};

exports.favoritarQuestao = async (req, res) => {
  const questoesFavoritas = req.user.questoesFavoritas.map(obj => obj.toString());

  // removes the heart if already exists, otherwise, uses mongodb addToSet to push it and make it unique
  const contemLike = questoesFavoritas.includes(req.params.id);
  const operador = contemLike ? '$pull' : '$addToSet';
  const incremento = contemLike ? -1 : 1;
  try {
    await User.findByIdAndUpdate(req.user._id, 
      { [operador]: { questoesFavoritas: req.params.id }}
    );

    const questao = await Questao.findByIdAndUpdate(req.params.id,
      { $inc: { likes: incremento }},
      { new: true}
    );
    res.json({ likes: questao.likes });
  } catch(err) {
    res.status(500).send(err);
  }
};
