const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const rascunhoSchema = new mongoose.Schema(
  {
    codigo: String,
    data: {
      type: Date,
      default: Date.now,
      index: -1
    },
    questao: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Questao'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: 1
    }
  },
  {
    collection: 'rascunhos'
  }
);

module.exports = mongoose.model('Rascunho', rascunhoSchema);
