const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
mongoose.Promise = global.Promise;

const questaoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: "Forneça um título",
      trim: true,
      unique: true
    },
    enunciado: {
      type: String,
      required: "Forneça um enunciado para a questão",
      trim: true
    },
    exemploEntrada: [String],
    exemploSaida: String,
    dificuldade: {
      type: Number,
      min: 1,
      max: 10
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
          required: "Forneça uma saída esperada para o vetor de entradas"
        }
      }],
      required: "Forneça um array de resultados"
    }
  },
  { collection: "questoes" }
);

questaoSchema.plugin(autoIncrement.plugin, {
  model: "Questao",
  field: "identificador"
});

module.exports = mongoose.model("Questao", questaoSchema);
