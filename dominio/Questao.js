const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;

const questaoSchema = new mongoose.Schema({
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
  exemploEntrada: {
    type: [{ type: String }],
    required: 'Forneça um exemplo de entrada'
  },
  exemploSaida: {
    type: String,
    required: 'Forneça um exemplo de saída'
  },
  dificuldade: {
    type: Number,
    min: 1,
    max: 10
  },
  tags: {
    type: [{ type: String }]
  },
  likes: {
    type: Number,
    default: 0
  },
  resultados: [
    {
      entradas: {
        type: [{ type: String }],
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        required: 'Forneça um conjunto de entradas'
      },
      saida: {
        type: String,
        required: 'Forneça uma saída esperada para o vetor de entradas'
      }
    }
  ]
}, 
{ collection: 'questoes' });

questaoSchema.plugin(autoIncrement.plugin, { model: 'Questao', field: 'identificador' });

module.exports = mongoose.model('Questao', questaoSchema);