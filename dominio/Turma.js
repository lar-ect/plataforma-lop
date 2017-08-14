const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const turmaSchema = mongoose.Schema({
	id: Number,
	idTurmaAgrupadora: Number,
	ano: Number,
	codigo: String,
	local: String,
	qtdMatriculados: Number,
	horariosTurma: [{
		dia: String,
		inicio: Number,
		fim: Number,
		turno: Number,
		dataInicio: String,
		dataFim: String,
		id: Number,
		descricaoTurno: String
	}],
	descricaoHorario: String,
	nomeComponente: String,
	codigoComponente: String,
	descricaoComponente: String,
	anoPeriodoString: String,
	descricaoCompleta: String,
	codigoString: String,
	descricaoTurma: String,
	descricao: String,
	dicentes: [{
		matricula: {
			type: String,
			required: 'É necessário uma matrícula'
		},
		nome: {
			type: String,
			required: 'É necessário um nome para o participante'
		},
		curso: String,
		municipio: String,
		grauAcademico: String,
		modalidade: String,
		turno: String,
		status: String
	}]
});

module.exports = mongoose.model('Turma', turmaSchema);