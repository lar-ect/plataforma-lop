const mongoose = require('mongoose');
const Submissao = mongoose.model('Submissao');

exports.getSubmissao = async (req, res) => {
	const submissao = await Submissao.findOne({ _id: req.params.id }).populate('user');
  res.render('submissao/index', { title: `Submissão #${submissao._id}`, submissao });
};