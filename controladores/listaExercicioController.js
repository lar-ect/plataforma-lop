const mongoose = require('mongoose');
const ListaExercicio = mongoose.model('ListaExercicio');

exports.getLista = async (req, res) => {
  const lista = await ListaExercicio.findOne({ _id: req.params.id }).populate('questoes');
  res.render('questao/lista', { title: `Lista ${lista.titulo}`, lista });
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