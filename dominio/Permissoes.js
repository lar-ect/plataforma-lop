const grupos = ['USUARIO', 'ALUNO', 'PROFESSOR', 'MONITOR', 'ADMINISTRADOR'];

const gruposPorPermissao = {
	READ_QUESTAO: ['USUARIO', 'ALUNO', 'MONITOR', 'PROFESSOR', 'ADMINISTRADOR'],
	CREATE_QUESTAO: ['ADMINISTRADOR'],
	UPDATE_QUESTAO: ['ADMINISTRADOR'],
	DELETE_QUESTAO: ['ADMINISTRADOR'],
	VER_GERENCIADOR: ['ADMINISTRADOR'],
	VER_SOLUCAO_QUESTAO: ['MONITOR', 'PROFESSOR', 'ADMINISTRADOR']
};

exports.grupos = grupos;

exports.temPermissao = (user, permissao) => {
	let retorno = false;
	user.grupos.forEach(grupo => {
		if (gruposPorPermissao[permissao].includes(grupo)) {
			retorno = true;
		}
	});
	return retorno;
};