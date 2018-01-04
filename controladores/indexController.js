const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const ListaExercicio = mongoose.model('ListaExercicio');
const Submissao = mongoose.model('Submissao');
const Suporte = mongoose.model('Suporte');
const permissoes = require('../dominio/Permissoes');

exports.redirectToIndex = (req, res) => {
  res.redirect('/');
};

exports.index = async (req, res) => {
  const questoes = await Questao.find({ oculta: { $in: [null, false] } });
  const listasExercicio = await ListaExercicio.find({});
  const tags = await Questao.find().distinct('tags');
  if (req.user) {
    const submissoes = await Submissao.listarSubmissoesUsuario(req.user);
    let questoesOcultas = null;
    if (permissoes.temPermissao(req.user, 'VER_QUESTOES_OCULTAS')) {
      questoesOcultas = await Questao.find({ oculta: true });
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
    return Submissao.calcularProgresso(
      lista.questoes.length,
      lista.questoes.filter(q => submissoes.has(q.toString())).length
    );
  }
  return progresso;
}

exports.suporte = (req, res) => {
  res.render('suporte', { title: 'Suporte', body: {} });
};

exports.enviarMensagemSuporte = async (req, res) => {
  if (!req.body.mensagem) {
    req.flash('danger', 'Forneça uma mensagem');
    res.render('suporte', { title: 'Suporte' });
    return;
  }

  if (req.body.email) {
    req.checkBody('email', 'E-mail inválido').isEmail();
    /**
     * Permite variações na forma de escrever os emails que são ignoradas pelos provedores
     * Ex.:
     * tibuurcio@gmail.com
     * Tibuurcio@gmail.com
     * tibuurcio@googlemail.com //uk
     * ti.b.uu.rcio@gmail.com
     * tibuurcio+text@gmail.com
     */
    req.sanitizeBody('email').normalizeEmail({
      remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddress: false,
      gmail_remove_dots: false,
      yahoo_remove_subaddress: false
    });

    const erros = req.validationErrors();
    if (erros) {
      req.flash('danger', erros.map(err => err.msg));
      res.render('suporte', { title: 'Suporte', body: req.body, flashes: req.flash() });
      return;
    }
  }

  const suporte = new Suporte(req.body);
  await suporte.save();

  req.flash('success', 'Mensagem enviada com sucesso.');
  res.redirect('/');
};

exports.processing = (req, res) => {
  res.render('processing', { title: 'Processing.js' });
};
