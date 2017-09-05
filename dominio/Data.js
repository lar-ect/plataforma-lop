const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dataSchema = new mongoose.Schema(
  {
    exec: Number 
  },
  { collection: 'data' }
);

module.exports = mongoose.model('Data', dataSchema);
