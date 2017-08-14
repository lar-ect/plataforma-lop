const mongoose = require('mongoose');
const Turma = mongoose.model('Turma');
const Submissao = mongoose.model('Submissao');

exports.getTurma = async (req, res) => {
  const turma = await Turma.findOne({ _id: req.params.id });
  const matriculas = turma.dicentes.map(d => d.matricula);
  const dicentes = turma.dicentes.sort((a, b) => {
    const nome1 = a.nome.toUpperCase();
    const nome2 = b.nome.toUpperCase();
    if (nome1 < nome2) return -1;
    if (nome1 > nome2) return 1;
    return 0;
  });
  const submissoes = await Submissao.find({}).populate('user', {
    'user.matricula': { $in: matriculas }
  }).populate('user');
  res.render('turma/index', { title: `Turma ${turma.descricao}`, turma, submissoes, dicentes });
};