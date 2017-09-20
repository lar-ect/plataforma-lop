const grupos = ['USUARIO', 'ALUNO', 'PROFESSOR', 'MONITOR', 'ADMINISTRADOR'];

const gruposPorPermissao = {
	// Questões
	READ_QUESTAO: ['USUARIO', 'ALUNO', 'MONITOR', 'PROFESSOR'],
	CREATE_QUESTAO: ['MONITOR', 'PROFESSOR'],
	UPDATE_QUESTAO: ['MONITOR', 'PROFESSOR'],
	DELETE_QUESTAO: ['MONITOR', 'PROFESSOR'],
	VER_SOLUCAO_QUESTAO: ['MONITOR', 'PROFESSOR'],
	VER_QUESTOES_OCULTAS: ['PROFESSOR'],
	
	// Gerência
	VER_GERENCIADOR: ['PROFESSOR', 'MONITOR'],

	// Provas
	READ_PROVA: ['PROFESSOR'],
	CREATE_PROVA: ['PROFESSOR'],
	UPDATE_PROVA: ['PROFESSOR'],
	DELETE_PROVA: ['PROFESSOR'],
	INICIAR_QUALQUER_PROVA: []
};

exports.grupos = grupos;

exports.isProfessor = (user) => {
	return user && (user.grupos.includes('PROFESSOR') || user.grupos.includes('ADMINISTRADOR'));
};

exports.isAdmin = (user) => {
	return user && user.grupos.includes('ADMINISTRADOR');
};

exports.temPermissao = (user, permissao) => {
	if (user && user.grupos.includes('ADMINISTRADOR')) {
		return true;
	}
	let retorno = false;
	
	if (user) {
		user.grupos.forEach(grupo => {
			if (gruposPorPermissao[permissao].includes(grupo)) {
				retorno = true;
			}
		});
	}
	return retorno;
};