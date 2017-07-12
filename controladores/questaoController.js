const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');

exports.questoes = async (req, res) => {
  const questoes = await Questao.find({});
  res.render('questoes', { title: 'Questões', questoes });
};

exports.getQuestao = async (req, res) => {
  const questao = await Questao.findOne({ identificador: req.params.identificador });
  res.render('questao', { title: `Questão ${questao.identificador}`, questao });
}

exports.adicionarQuestao = (req, res) => {
  console.log('teste');
  res.render('editarQuestao', { title: 'Adicionar Questão' });
};

exports.criarQuestao = async (req, res) => {
  req.body.entrada = req.body.entrada.trim().split('\r\n');
  req.body.saidaEsperada = req.body.saidaEsperada.trim().split('\r\n');
  const questao = await new Questao(req.body).save();
  req.flash('success', 'Adicionou uma nova questão com sucesso!');
  res.redirect(`/questao/${questao.identificador}`);
};

exports.atualizarQuestao = (req, res) => {

};