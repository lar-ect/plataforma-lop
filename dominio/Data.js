const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dataSchema = new mongoose.Schema(
  {
    exec: Number,
    cliqueNovidades: Number
  },
  { collection: 'data' }
);

module.exports = mongoose.model('Data', dataSchema);
