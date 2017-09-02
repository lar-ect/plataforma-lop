const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const passportLocalMongoose = require('passport-local-mongoose');

const Permissoes = require('./Permissoes');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: 'Email já cadastrado no sistema',
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Email inválido'],
    required: 'Forneça um endereço de email'
  },
  matricula: {
    type: String,
    unique: 'Matrícula já cadastrada no sistema',
    trim: true
  },
  nome: {
    type: String,
    required: 'Forneça um nome',
    trim: true
  },
  grupos: {
    type: [String],
    enum: Permissoes.grupos,
    default: ['USUARIO'],
    required: true
  },
  // githubData: {},
  sigaa: {
    turmas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Turma' }]
  },
  questoesFavoritas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Questao' }],
  listasFavoritas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ListaExercicio' }],
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(passportLocalMongoose, { 
  usernameField: 'email',
  errorMessages: {
    UserExistsError: 'Já existe um usuário cadastrado com esse email'
  }
});

userSchema.methods.favoritarQuestao = function(id) {
  if (this.questoesFavoritas.indexOf(id) === -1) {
    this.questoesFavoritas.push(id);
  }
  return this.save();
};

userSchema.methods.desfavoritarQuestao = function(id) {
  this.questoesFavoritas.remove(id);
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
