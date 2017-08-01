const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const listaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: 'Forneça um título',
      trim: true,
      unique: true
	},
	questoes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Questao' }],
	likes: {
      type: Number,
      default: 0
    }
  },
  { collection: 'listasExercicios' }
);

function autopopulate(next) {
  this.populate('questoes');
  next();
}

listaSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('ListaExercicio', listaSchema);
