const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const submissaoProvaSchema = new mongoose.Schema(
  {
    codigo: String,
    data: {
      type: Date,
      default: Date.now,
      index: -1
    },
    questao: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Questao',
      required: 'Informe uma questão para a submissão'
    },
    tempoExecucao: {
      type: Number
    },
    porcentagemAcerto: {
      type: Number,
      required: 'Informe uma porcentagem de acerto para a submissão'
    },
    resultados: {
      type: [{
        entradas: [{ type: String }],
        saidaEsperada: String,
        saida: String
      }]
    },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: 1 },
	prova: { type: mongoose.Schema.Types.ObjectId, ref: 'Prova', index: 1 }
  },
  { collection: 'submissoesProva' }
);

function autopopulate(next) {
  this.populate('questao');
  next();
}

submissaoProvaSchema.statics.listarSubmissoesUsuario = async function (user, questoes = null, dataInicial, dataFinal) {
  let $match = { user: { $eq: user._id } };
  if (questoes) {
    $match.questao = { $in: questoes }
  }
  const submissoes = await this.aggregate([
    {
      $match
    },
    {
      $group: {
        _id: "$questao",
        count: { $sum: 1 }
      }
    }
  ]);
  return new Map(submissoes.map(sub => [sub._id.toString(), sub.count]));
};

submissaoProvaSchema.pre('find', autopopulate);

module.exports = mongoose.model('SubmissaoProva', submissaoProvaSchema);