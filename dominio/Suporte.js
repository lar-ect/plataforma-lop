const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const suporteSchema = new mongoose.Schema(
  {
    nome: String,
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    data: {
      type: Date,
      default: Date.now
    },
    mensagem: {
      type: String,
      required: 'Forneça uma mensagem'
    },
    resolvido: {
      type: Boolean,
      default: false
    }
  },
  { collection: 'suporte' }
);

module.exports = mongoose.model('Suporte', suporteSchema);
