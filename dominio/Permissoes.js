const grupos = ['USUARIO', 'ALUNO', 'PROFESSOR', 'MONITOR', 'ADMINISTRADOR'];

const gruposPorPermissao = {
	READ_QUESTAO: ['USUARIO', 'ALUNO', 'PROFESSOR', 'MONITOR', 'ADMINISTRADOR'],
	CREATE_QUESTAO: ['ADMINISTRADOR'],
	UPDATE_QUESTAO: ['ADMINISTRADOR'],
	DELETE_QUESTAO: ['ADMINISTRADOR'],
	VER_GERENCIADOR: ['ADMINISTRADOR']
};

exports.grupos = grupos;

exports.isAdministrador = (grupos) => {
	return grupos.includes('ADMINISTRADOR');
};

exports.temPermissao = (grupos, permissao) => {
	let retorno = false;
	grupos.forEach(grupo => {
		if (gruposPorPermissao[permissao].includes(grupo)) {
			retorno = true;
		}
	});
	return retorno;
};