const grupos = ['USUARIO', 'ALUNO', 'PROFESSOR', 'MONITOR', 'ADMINISTRADOR'];

const gruposPorPermissao = {
	READ_QUESTAO: ['USUARIO', 'ALUNO', 'MONITOR', 'PROFESSOR'],
	CREATE_QUESTAO: ['MONITOR'],
	UPDATE_QUESTAO: ['MONITOR'],
	DELETE_QUESTAO: ['MONITOR'],
	VER_GERENCIADOR: [],
	VER_SOLUCAO_QUESTAO: ['MONITOR', 'PROFESSOR']
};

exports.grupos = grupos;

exports.isProfessor = (user) => {
	return user.grupos.includes('PROFESSOR');
};

exports.temPermissao = (user, permissao) => {
	if (user.grupos.includes('ADMINISTRADOR')) {
		return true;
	}
	let retorno = false;
	user.grupos.forEach(grupo => {
		if (gruposPorPermissao[permissao].includes(grupo)) {
			retorno = true;
		}
	});
	return retorno;
};