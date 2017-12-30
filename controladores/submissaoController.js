const mongoose = require('mongoose');
const permissoes = require('../dominio/Permissoes');
const Submissao = mongoose.model('Submissao');

exports.getSubmissao = async (req, res) => {
  const submissao = await Submissao.findOne({ _id: req.params.id }).populate('user');
  if (req.user && (req.user.id == submissao.user.id || permissoes.isProfessor(req.user))) {
    res.render('submissao/index', { title: `Submissão #${submissao._id}`, submissao });
  } else {
    req.flash('warning', 'Oops, você não pode acessar essa página');
    res.redirect('back');
  }
};
