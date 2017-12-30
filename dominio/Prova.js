const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uniqueValidator = require('mongoose-unique-validator');

const provaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: 'Forneça um título',
      trim: true,
      unique: true
    },
    duracao: {
      type: Number,
      required: 'Forneça uma duração'
    },
    iniciou: {
      type: Date,
      index: true
    },
    finalizou: {
      type: Date,
      index: true
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    turmas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Turma' }],
    questoes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Questao' }],
      required: 'Forneça questões'
    }
  },
  { collection: 'provas' }
);

function autopopulate(next) {
  this.populate('questoes');
  this.populate('autor');
  next();
}

provaSchema.pre('findOne', autopopulate);
provaSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Prova', provaSchema);
