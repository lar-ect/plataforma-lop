const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const sessionsSchema = new mongoose.Schema(
  {
    _id: 'string',
    session: 'string',
    expires: Date
  },
  { collection: 'sessions' }
);

module.exports = mongoose.model('Sessions', sessionsSchema);
