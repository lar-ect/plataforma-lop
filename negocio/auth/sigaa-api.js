const axios = require('axios');

class SIGAA {
	constructor(accessToken) {
		this.req = axios.create({
			baseURL: 'http://apitestes.info.ufrn.br/ensino-services/services/',
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		});
	}

	listaVinculos() {
		return this.req.get('consulta/listavinculos/usuario');
	}

	getPerfilUsuario(idUsuario) {
		return this.req.get(`consulta/perfilusuario/${idUsuario}`);
	} 

	listaTurmasDocente() {
		return this.req.get('consulta/turmas/usuario/docente');
	}

	listaParticipantesTurma(idTurma) {
		return this.req.get(`consulta/listaparticipantesturma/usuario/${idTurma}`);
	}

	listaAlunosTurma(idTurma) {
		return this.req.get(`consulta/turmas/usuario/docente/situacao/${idTurma}`);
	}
}

module.exports = SIGAA;