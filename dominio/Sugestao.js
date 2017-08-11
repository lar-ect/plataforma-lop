const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const sugestaoSchema = new mongoose.Schema({
	sugestao: {
		type: String,
		required: 'É necessário um texto para a sugestão'
	},
	data: {
		type: Date,
		default: Date.now
	}
}, { collection: 'sugestoes' });

module.exports = mongoose.model('Sugestao', sugestaoSchema);