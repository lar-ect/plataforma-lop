const promisify = require('es6-promisify');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Questao = mongoose.model('Questao');
const Submissao = mongoose.model('Submissao');

exports.perfil = async (req, res) => {
  const submissoes = await Submissao.find({ user: req.user });
  res.render('usuario/perfil', { title: 'Perfil', submissoes });
};

exports.loginForm = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

exports.cadastroForm = (req, res) => {
  res.render('auth/cadastro', { title: 'Cadastro' });
};

exports.registrar = async (req, res, next) => {
  const user = new User({ email: req.body.email, nome: req.body.nome, matricula: req.body.matricula });
  const registerWithPromise = promisify(User.register, User);
  await registerWithPromise(user, req.body.password);
  next();
};

exports.validarRegistro = (req, res, next) => {
  req.sanitizeBody('nome');
  req.checkBody('nome', 'Por favor informe um nome').notEmpty();
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
    gmail_remove_subaddress: false
  });

  req.checkBody('password', 'Por favor informe uma senha').notEmpty();
  req.checkBody('password-confirm', 'Senhas não coincidem').equals(req.body.password);

  const erros = req.validationErrors();
  if (erros) {
    req.flash('danger', erros.map(err => err.msg));
    res.render('auth/cadastro', {title: 'Cadastro', body: req.body, flashes: req.flash() });
    return;
  }
  
  next();
};

// exports.signInViaGithub

