const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dificuldades = ['Muito fácil', 'Fácil', 'Médio', 'Difícil', 'Muito difícil'];
const classificacoes = ['Fixação', 'Complementar', 'Avançado'];

const questaoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: 'Forneça um título',
      trim: true,
      unique: true
    },
    enunciado: {
      type: String,
      required: 'Forneça um enunciado para a questão',
      trim: true
    },
    exemploEntrada: [String],
    exemploSaida: String,
    solucao: String,
    classificacao: {
      type: String,
      enum: classificacoes,
      required: 'Por favor escolha uma classificação',
    },
    dificuldade: {
      type: String,
      enum: dificuldades,
      required: 'Por favor escolha uma dificuldade'
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: {
      type: [{ type: String }]
    },
    likes: {
      type: Number,
      default: 0
    },
    resultados: {
      type: [{
        entradas: {
          type: [{ type: String }],
        },
        saida: {
          type: String,
          required: 'Forneça uma saída esperada para o vetor de entradas'
        }
      }],
      required: 'Forneça um array de resultados'
    }
  },
  { collection: 'questoes' }
);

questaoSchema.statics.getDificuldades = function() {
  return dificuldades;
};

questaoSchema.statics.getClassificacoes = function() {
  return classificacoes;
};

module.exports = mongoose.model('Questao', questaoSchema);
