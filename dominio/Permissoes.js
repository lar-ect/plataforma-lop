const grupos = ['USUARIO', 'ALUNO', 'PROFESSOR', 'MONITOR', 'ADMINISTRADOR'];

const gruposPorPermissao = {
	READ_QUESTAO: ['USUARIO', 'ALUNO', 'MONITOR', 'PROFESSOR'],
	CREATE_QUESTAO: ['MONITOR', 'PROFESSOR'],
	UPDATE_QUESTAO: ['MONITOR', 'PROFESSOR'],
	DELETE_QUESTAO: ['MONITOR', 'PROFESSOR'],
	VER_GERENCIADOR: [],
	VER_SOLUCAO_QUESTAO: ['MONITOR', 'PROFESSOR'],
	VER_QUESTOES_OCULTAS: ['PROFESSOR']
};

exports.grupos = grupos;

exports.isProfessor = (user) => {
	return user && user.grupos.includes('PROFESSOR');
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