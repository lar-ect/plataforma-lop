const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const submissaoSchema = new mongoose.Schema(
  {
		data: {
			type: Date,
			default: Date.now
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
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	},
  { collection: 'submissoes' }
);

function autopopulate(next) {
  this.populate('questao');
  next();
}

submissaoSchema.pre('find', autopopulate);

module.exports = mongoose.model('Submissao', submissaoSchema);
