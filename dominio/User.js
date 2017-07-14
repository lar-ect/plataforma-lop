const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Email inválido'],
    required: 'Forneça um endereço de email'
  },
  name: {
    type: String,
    required: 'Forneça um nome',
    trim: true
  },
  questoesFavoritas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Questao' }],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' }); 
userSchema.plugin(mongodbErrorHandler);

userSchema.methods.favoritarQuestao = function(id) {
  if (this.questoesFavoritas.indexOf(id) === -1) {
    this.questoesFavoritas.push(id);
  }
  return this.save();
}

userSchema.methods.desfavoritarQuestao = function(id) {
  this.questoesFavoritas.remove(id);
  return this.save();
}

module.exports = mongoose.model('User', userSchema);