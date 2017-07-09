const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;

const questaoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: 'Forneça um título',
    trim: true
  },
  enunciado: {
    type: String,
    required: 'Forneça um enunciado para a questão',
    trim: true
  },
  exemploEntrada: {
    type: String,
    required: 'Forneça um exemplo de entrada'
  },
  exemploSaida: {
    type: String,
    required: 'Forneça um exemplo de saída'
  },
  entrada: {
    type: [String],
    required: 'Forneça uma entrada para a questão',
  },
  saidaEsperada: {
    type: [String],
    required: 'Forneça uma saída esperada para a questão'
  }
}, 
{ collection: 'questoes' });

questaoSchema.plugin(autoIncrement.plugin, { model: 'Questao', field: 'identificador' });

module.exports = mongoose.model('Questao', questaoSchema);