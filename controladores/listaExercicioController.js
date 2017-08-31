const mongoose = require('mongoose');
const ListaExercicio = mongoose.model('ListaExercicio');
const Submissao = mongoose.model('Submissao');

exports.getLista = async (req, res) => {
  const lista = await ListaExercicio.findOne({ _id: req.params.id }).populate('questoes');

  if (req.user) {

    var submissoesUsuario = await Submissao.aggregate([
      {
        $match:
        {
          user: { $eq: req.user._id },
          questao: { $in: lista.questoes }
        }
      },
      {
        $group: {
          _id: "$questao",
          count: { $sum: 1 }
        }
      }
    ]);
    const submissoesMap = new Map(submissoesUsuario.map(sub => [sub._id.toString(), sub.count]));
    const progresso = {};
    const total = lista.questoes.length;
    const quantidadeResolvidas = submissoesMap.size;
    const porcentagem = (quantidadeResolvidas * 100) / total;
    progresso['porcentagem'] = Math.round(porcentagem)
    progresso['quantidadeResolvidas'] = quantidadeResolvidas;
    progresso['quantidadeTotal'] = total;
    res.render('questao/lista', { title: `Lista ${lista.titulo}`, lista, progresso, submissoesMap });
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

exports.criarLista = async (req, res) => {
  const novaLista = {
    titulo: req.body.titulo,
    questoes: req.body.questoes
  };
  const lista = await new ListaExercicio(novaLista).save();
  req.flash("success", "Adicionou uma nova lista de exercícios com sucesso!");
  res.redirect(`/lista/${lista._id}`);
};