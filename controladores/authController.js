const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const permissoes = require('../dominio/Permissoes');

exports.temPermissao = (permissao) => {
  return (req, res, next) => {
    if (req.user && permissoes.temPermissao(req.user.grupos, permissao)) {
      next();
    }
    else {
      req.flash('warning', 'Oops, você não pode acessar essa página');
      res.redirect('back');
    }
  };
};

exports.login = passport.authenticate('local', {
  failuteRedirect: '/login',
  failureFlash: 'Erro ao tentar entrar no sistema',
  successRedirect: '/',
  successFlash: 'Você entrou no sistema com sucesso!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Até a próxima! 👋');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('warning', 'Oops, você tem que estar logado para ver essa página 😁');
  res.redirect('/login');
};

exports.esqueceuSenha = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('success', 'E-mail de alteração de senha enviado');
    return res.redirect('/login');
  }

  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1h para resetar a senha
  await user.save();

  const resetUrl = `http://${req.headers.host}/conta/resetar-senha/${user.resetPasswordToken}`;
  // email
  req.flash('success', `Visite a seguinte url para resetar sua senha ${resetUrl}`);
  res.redirect('/login');
};

exports.resetarSenha = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if(!user) {
    req.flash('error', 'Link para resetar senha inválido ou expirado');
    return res.redirect('/login');
  }

  res.render('auth/resetar-senha', { title: 'Nova senha' });
};

exports.confirmarSenhas = (req, res, next) => {
  if(req.body.password === req.body['password-confirm']) {
    next();
    return;
  }

  req.flash('danger', 'Senhas não coincidem');
  res.redirect('back');
};

exports.atualizarSenha = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if(!user) {
    req.flash('danger', 'Link para resetar senha é inválido ou expirou');
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', 'Sua senha foi resetada com sucesso! 😁 Você está logado agora...');
  res.redirect('/');
};