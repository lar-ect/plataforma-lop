const mongoose = require('mongoose');
const Prova = mongoose.model('Prova');
const Questao = mongoose.model('Questao');
const Turma = mongoose.model('Turma');
const Submissao = mongoose.model('Submissao');
const Rascunho = mongoose.model('Rascunho');
const SubmissaoProva = mongoose.model('SubmissaoProva');
const permissoes = require('../dominio/Permissoes');
const moment = require('moment');
const arrayUtil = require('lodash/array'); //https://lodash.com/docs
const { calcularDiferenca } = require('../helpers');

exports.getQuestao = async (req, res, next) => {
	const questaoId = req.params.idQuestao;
	const prova = req.prova;
	let idProximaQuestao = null, idQuestaoAnterior = null;
	const questoes = prova.questoes.map(q => q.id);
    const questaoAtualIndex = questoes.indexOf(questaoId);
    if (questaoAtualIndex > 0) {
      idQuestaoAnterior = questoes[questaoAtualIndex - 1];
    }
    
    if (questaoAtualIndex < questoes.length - 1) {
      idProximaQuestao = questoes[questaoAtualIndex + 1];
	}
	const questao = await Questao.findOne({ _id: questaoId });
	const rascunho = await Rascunho.findOne({ questao, user: req.user });
	res.render('prova/questao', {
	  title: questao.titulo,
	  questao,
	  prova,
	  idQuestaoAnterior,
		idProximaQuestao,
		rascunho
	});
};

exports.podeSubmeter = async (req, res, next) => {
	const { questaoId, provaId } = req.body;
	const prova = await Prova.findOne({ _id: provaId });
	const agora = moment(new Date());
	const fimProva = moment(prova.iniciou).add(prova.duracao, 'minutes');

	if (!prova.finalizou && agora.isAfter(fimProva)) {
		prova.finalizou = fimProva;
		await prova.save();
		req.status(500).send('Tempo esgotado');
		return;
	}
	else if (prova.finalizou) {
		req.status(500).send('Tempo esgotado');
	}
	else {
		req.prova = prova;
		//TODO: Verificar se o usuário possui matrícula presente em uma turma cadastrada na prova
		next();
	}
};

exports.isAutorProva = async (req, res, next) => {
	const provaId = req.query.id || req.params.id;
	const prova = await Prova.findOne({ _id: provaId });
	if (prova.autor.id === req.user.id || permissoes.temPermissao(req.user, 'INICIAR_QUALQUER_PROVA')) {
		//console.log('É autor da prova ou administrador');
		req.prova = prova;
		next();
	}
	else {
		//console.log('Não pode iniciar prova, não é autor nem administrador');
		req.flash('warning', 'Oops, você não pode realizar essa operação');
		res.redirect('/');
	}
};

exports.iniciarProva = async (req, res) => {
	if (req.prova.iniciou && !req.prova.finalizou) {
		req.flash('warning', 'Prova já iniciada');
		req.redirect('/');
	}
	else if (req.prova.finalizou) {
		req.flash('warning', 'Prova já foi finalizada');
		req.redirect('/');
	}
	else {
		await Prova.update({ _id: req.prova._id }, { $set: { iniciou: Date.now() }});
		console.log(`Prova iniciada com sucesso por ${req.prova.autor.nome} em ${Date.now()}`);
		req.flash('success', 'Prova iniciada com sucesso');
		res.redirect('/');
	}
};

exports.verificarTempoLimite = async (req, res, next) => {
	// console.log('Verificando tempo limite da prova');
	const prova = await Prova.findOne({ _id: req.params.id });
	console.log(prova);
	const agora = moment(new Date());
	// console.log(`Agora: ${agora.format('DD/MM/YYYY - HH:mm')}`);
	const fimProva = moment(prova.iniciou).add(prova.duracao, 'minutes');
	// console.log(`Fim prova: ${fimProva.format('DD/MM/YYYY - HH:mm')}`);

	if (!prova.finalizou && agora.isAfter(fimProva)) {
		console.log('Passou do horário da prova e não havia finalizado. Finalizando...');
		prova.finalizou = fimProva;
		await prova.save();
	}

	req.prova = prova;
	next();
};

/**
 * Recupera a prova pelo id e adiciona o objeto na resquisição
 */
exports.recuperarProva = async (req, res, next) => {
	const prova = await Prova.findOne({ _id: req.params.id });
	req.prova = prova;
	next();
};

exports.podeVerProvaRelatorio = (req, res, next) => {
	console.log('Pode ver relatório de prova?');
	const prova = req.prova;
	const turmas = prova.turmas;
	const turmasUser = req.user.sigaa.turmas;
	if (permissoes.isAdmin(req.user) || req.user.id === prova.autor.id) {
		console.log('Admin ou autor da prova');
		next();
	}
	else if (arrayUtil.intersectionWith(turmas, turmasUser, (a, b) => a.equals(b)).length > 0) {
		console.log('Professor de uma turma da prova');
		next();
	}
	else {
		req.flash('warning', 'Você não tem permissão para acessar essa página');
		res.redirect('/');
	}
};

exports.getProvaRelatorio = async (req, res) => {
	const prova = req.prova;
	let submissoes = await SubmissaoProva.aggregate([
		{ $match: { prova: prova._id } },
		{ $lookup: {
			from: 'questoes',
			localField: 'questao',
			foreignField: '_id',
			as: 'questao'
		}},
		{ $unwind: '$questao'},
		{ $group: {
			_id: '$user',
			submissoes: { $push: '$$CURRENT' },
			user: { $first: '$user' },
			acerto: { $max: '$$CURRENT.porcentagemAcerto' }
		} },
		{ $unwind: '$user' },
		{ $lookup: {
			from: 'users',
			localField: 'user',
			foreignField: '_id',
			as: 'user'
		}},
		{ $unwind: '$user' },
	]);

	const totalSubmissoes = submissoes.length;

	let turmas = await Turma.find({ _id: { $in: prova.turmas } });
	turmas = turmas.map(t => {
		return {
			id: t._id,
			codigo: t.codigoString,
			dicentes: t.dicentes.map(d => d.matricula)
		};
	});

	submissoes.forEach(sub => {
		sub.user.nome = sub.user.nome.toUpperCase();
	});

	submissoes = submissoes.sort((a, b) => a.user.nome.localeCompare(b.user.nome));

	let submissoesPorTurma = [];
	turmas.forEach(t => {
		submissoesPorTurma.push({
			turmaId: t.id,
			turmaCodigo: t.codigo,
			submissoes: submissoes.filter(sub => t.dicentes.includes(sub.user.matricula))
		});
	});

	res.render('prova/relatorio', {
		title: 'Relatório de prova',
		prova,
		submissoesPorTurma,
		totalSubmissoes
	});
};

/**
 * A prova vem em req.prova
 * Um usuário pode ver a prova se sua matrícula estiver presente em alguma das turmas presente
 * no cadastro da prova. 
 * Um usuário pode ver a prova se ele for o professor que a cadastrou.
 * Um usuário pode ver a prova se ele for administrador.
 */
exports.podeVerProva = async (req, res, next) => {
	console.log('Pode ver a prova?');

	const prova = req.prova;

	if (permissoes.isAdmin(req.user) || req.user.id === prova.autor.id) {
		console.log('É administrador ou autor da prova');
		req.prova = prova;
		next();
	}
	// else if (prova.turmas) {
		
	// }
	else if (!prova.iniciou || prova.finalizou) {
		// console.log('Prova ainda não iniciou ou já finalizou e não é autor ou administrador');
		req.flash('warning', 'Você não tem permissão para acessar essa página');
		res.redirect('/');
	}
	else {
		const turmas = await Turma.find({ _id: { $in: prova.turmas }});
		const usersMatricula = [].concat.apply([], turmas.map(t => t.dicentes)).map(d => d.matricula);

		if (usersMatricula.includes(req.user.matricula)) {
			//console.log('É aluno com a matrícula presente em uma turma da prova');
			req.prova = prova;
			next();
		}
		else {
			console.log('Não tem permissão de ver a prova');
			req.flash('warning', 'Você não tem permissão para acessar essa página');
			res.redirect('/');
		}
	}
};

exports.findProvaByUserId = async (req, res, next) => {
	if (permissoes.isAdmin(req.user)) {
		const provas = await Prova.find({ 
			iniciou: { $exists: true },
			finalizou: { $exists: false }
		});
		req.provasUsuario = provas;
	}
	else if (req.user && req.user.matricula) {
		const userId = req.user.id;
		const provas = await Prova.find({ 
			iniciou: { $exists: true },
			finalizou: { $exists: false }
		}).populate('turmas');
		const provasUsuario = [];

		provas.forEach(prova => {
			const turmas = prova.turmas;
			const usersMatricula = [].concat.apply([], turmas.map(t => t.dicentes)).map(d => d.matricula);
			if (usersMatricula.includes(req.user.matricula)) {
				// Prova é do tipo mongoose model e por isso não dá pra deletar atributos normalmente
				// Necessário converter para objeto javascript utilizando toObject()
				const provaObj = prova.toObject();
				delete provaObj['turmas'];
				provasUsuario.push(provaObj);
			}
		});

		req.provasUsuario = provasUsuario;
	}

	next();
};

// Prova deve vir em req.prova
exports.getProva = async (req, res) => {
	const prova = req.prova;
	const submissoes = await SubmissaoProva.listarSubmissoesUsuario(req.user, prova.questoes.map(q => q._id));
	const progresso = Submissao.calcularProgresso(prova.questoes.length, submissoes.size);
	const fim = moment(prova.iniciou).add(prova.duracao, 'minutes');
	const tempoRestante = calcularDiferenca(moment().utc(), fim);
	res.render('questao/lista', { 
		title: `Prova ${req.prova.titulo}`, 
		lista: req.prova, 
		progresso, 
		submissoes, 
		prova: true,
		tempoRestante
	});
};

exports.adicionarProva = async (req, res) => {
	const id = req.params.id;
	const prova = await Prova.findOne({ _id: id });
	const questoesOcultas = await Questao.find({oculta: true});
	const turmas = await Turma.find({});
	res.render('questao/editarProva', {
		title: 'Adicionar prova',
		questoes: questoesOcultas,
		turmas,
		prova
	});
};

exports.editarProva = async (req, res) => {
	req.body.questoes = Object.keys(req.body.questoes);
	const prova = await Prova.findOne({ _id: req.params.id });
	const duracao = prova.duracao;
	const novaDuracao = req.body.duracao;

	// Remove o horário de finalização caso a prova já houver sido finalizada e a duração tiver mudado
	if (prova.duracao != duracao) {
		req.body.duracao = novaDuracao;
	}

	const novaProva = await Prova.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
    runValidators: true
	}).exec();

	novaProva.finalizou = undefined;
	await novaProva.save();
	
  req.flash('success','Atualizou a prova com sucesso');
  res.redirect(`/prova/${prova._id}`);
};

exports.criarProva = async (req, res) => {
	req.body.questoes = Object.keys(req.body.questoes);
	const prova = await new Prova(req.body).save();
	req.flash('success', 'Adicionou nova prova com sucesso');
	res.redirect('/');
};