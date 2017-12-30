const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const sessionsSchema = new mongoose.Schema({
 	_id: 'string',
 	session: 'string',
 	expires: Date
});

module.exports = mongoose.model('Sessions', sessionsSchema);