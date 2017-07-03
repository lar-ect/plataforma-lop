const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const questaoSchema = new mongoose.Schema({
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
  entradaEsperada: {
    type: String,
  }
});